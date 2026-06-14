<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Redis;

class ProductAnalyticsService
{
    public function trackView(Product $product): void
    {
        $product->increment('view_count');
        // Redis tracking for real-time popular sorting could go here
    }

    public function getSellerProductStats(string $sellerId): array
    {
        $products = Product::where('seller_id', $sellerId)->get();
        
        return [
            'total_products' => $products->count(),
            'total_views' => $products->sum('view_count'),
            'out_of_stock' => $products->where('stock_status', \App\Enums\StockStatus::OUT_OF_STOCK->value)->count(),
            'published' => $products->where('product_status', \App\Enums\ProductStatus::PUBLISHED->value)->count(),
        ];
    }
}
