<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Marketplace;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    use ApiResponse;

    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        $perPage = $request->get('per_page', 16);

        if (empty(trim($query))) {
            return $this->errorResponse('Search query is required', 422);
        }

        $products = Product::active()
            ->with(['category:id,name,slug', 'seller:id,first_name,last_name', 'images'])
            ->where(function ($q) use ($query) {
                $q->where('name', 'ilike', "%{$query}%")
                  ->orWhere('description', 'ilike', "%{$query}%")
                  ->orWhere('origin', 'ilike', "%{$query}%")
                  ->orWhereHas('category', fn($q) => $q->where('name', 'ilike', "%{$query}%"));
            })
            ->orderByRaw("CASE WHEN name ILIKE ? THEN 0 ELSE 1 END", ["%{$query}%"])
            ->orderBy('view_count', 'desc')
            ->paginate($perPage);

        $categories = Category::active()
            ->where('name', 'ilike', "%{$query}%")
            ->withCount(['products' => fn($q) => $q->active()])
            ->limit(5)
            ->get(['id', 'name', 'slug', 'icon']);

        return $this->successResponse([
            'query' => $query,
            'products' => $products,
            'categories' => $categories,
            'total_results' => $products->total(),
        ], 'Search completed');
    }
}
