<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Marketplace;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Product::active()
            ->with(['category:id,name,slug', 'seller:id,first_name,last_name', 'images', 'tags'])
            ->withCount([]);

        // Filter
        if ($request->filled('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        if ($request->boolean('popular')) {
            $query->popular();
        }

        // Sort
        match ($request->get('sort', 'newest')) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'popular' => $query->orderBy('view_count', 'desc'),
            'featured' => $query->orderBy('is_featured', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $products = $query->paginate($request->get('per_page', 16));

        return $this->successResponse($products, 'Products retrieved');
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)
            ->where('product_status', 'PUBLISHED')
            ->with([
                'category:id,name,slug',
                'seller:id,first_name,last_name',
                'seller.sellerProfile',
                'images',
                'tags',
                'inventory',
            ])
            ->firstOrFail();

        // Increment view count
        $product->increment('view_count');

        return $this->successResponse($product, 'Product retrieved');
    }

    public function featured(): JsonResponse
    {
        $products = Product::active()
            ->featured()
            ->with(['category:id,name,slug', 'seller:id,first_name,last_name', 'images', 'tags'])
            ->orderBy('view_count', 'desc')
            ->limit(8)
            ->get();

        return $this->successResponse($products, 'Featured products retrieved');
    }

    public function popular(): JsonResponse
    {
        $products = Product::active()
            ->popular()
            ->with(['category:id,name,slug', 'seller:id,first_name,last_name', 'images', 'tags'])
            ->orderBy('view_count', 'desc')
            ->limit(8)
            ->get();

        return $this->successResponse($products, 'Popular products retrieved');
    }
}
