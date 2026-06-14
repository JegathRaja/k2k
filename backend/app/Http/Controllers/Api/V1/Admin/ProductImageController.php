<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductImageController extends Controller
{
    use ApiResponse;

    public function store(Request $request, string $productId)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $product = Product::findOrFail($productId);

        $file = $request->file('image');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('products', $filename, 'public');

        $isPrimary = $product->images()->count() === 0;

        $image = $product->images()->create([
            'image_url' => Storage::url($path),
            'image_path' => $path,
            'is_primary' => $isPrimary,
            'display_order' => $product->images()->count() + 1,
        ]);

        return $this->success($image, 'Image uploaded successfully', 201);
    }

    public function destroy(string $productId, string $imageId)
    {
        $product = Product::findOrFail($productId);
        $image = $product->images()->findOrFail($imageId);

        if (Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();

        // If it was primary, set another one to primary
        if ($image->is_primary && $product->images()->exists()) {
            $product->images()->first()->update(['is_primary' => true]);
        }

        return $this->success(null, 'Image deleted successfully');
    }

    public function setPrimary(string $productId, string $imageId)
    {
        $product = Product::findOrFail($productId);
        
        $product->images()->update(['is_primary' => false]);
        $product->images()->findOrFail($imageId)->update(['is_primary' => true]);

        return $this->success(null, 'Primary image updated successfully');
    }
}
