<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\ImageUploadService;
use App\Services\Seller\ProductService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ProductService $productService,
        private readonly ImageUploadService $imageUploadService
    ) {}

    public function index(Request $request)
    {
        $seller = $request->user();
        $products = Product::where('seller_id', $seller->id)
            ->with(['category', 'images'])
            ->latest()
            ->paginate($request->get('per_page', 10));

        return $this->success($products, 'Products retrieved successfully');
    }

    public function store(Request $request)
    {
        $seller = $request->user();
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'weight_unit' => 'required|string',
            'short_description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors()->toArray());
        }

        $product = $this->productService->createProduct($seller, $validator->validated());

        return $this->success($product, 'Product created successfully', 201);
    }

    public function show(Request $request, string $id)
    {
        $seller = $request->user();
        $product = Product::where('seller_id', $seller->id)
            ->with(['category', 'images', 'inventoryTransactions'])
            ->findOrFail($id);

        return $this->success($product, 'Product retrieved successfully');
    }

    public function update(Request $request, string $id)
    {
        $seller = $request->user();
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:categories,id',
            'price' => 'sometimes|numeric|min:0',
            'available_quantity' => 'sometimes|numeric|min:0',
            'product_status' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors()->toArray());
        }

        $product = $this->productService->updateProduct($seller, $id, $validator->validated());

        return $this->success($product, 'Product updated successfully');
    }

    public function destroy(Request $request, string $id)
    {
        $seller = $request->user();
        $this->productService->deleteProduct($seller, $id);

        return $this->success(null, 'Product deleted successfully');
    }

    public function publish(Request $request, string $id)
    {
        $seller = $request->user();
        $product = $this->productService->publishProduct($seller, $id);

        return $this->success($product, 'Product published successfully');
    }

    public function archive(Request $request, string $id)
    {
        $seller = $request->user();
        $product = $this->productService->archiveProduct($seller, $id);

        return $this->success($product, 'Product archived successfully');
    }

    public function uploadImage(Request $request, string $id)
    {
        $seller = $request->user();
        $product = Product::where('seller_id', $seller->id)->findOrFail($id);

        $request->validate([
            'image' => 'required|image|max:5120', // 5MB max
        ]);

        $url = $this->imageUploadService->uploadProductImage($request->file('image'));

        $isPrimary = $product->images()->count() === 0;

        $image = $product->images()->create([
            'image_url' => $url,
            'is_primary' => $isPrimary,
        ]);

        return $this->success($image, 'Image uploaded successfully');
    }

    public function deleteImage(Request $request, string $id, string $imageId)
    {
        $seller = $request->user();
        $product = Product::where('seller_id', $seller->id)->findOrFail($id);
        
        $image = $product->images()->findOrFail($imageId);
        
        $this->imageUploadService->deleteImage($image->image_url);
        $image->delete();

        return $this->success(null, 'Image deleted successfully');
    }
}
