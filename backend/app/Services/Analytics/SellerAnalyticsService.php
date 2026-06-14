<?php

namespace App\Services\Analytics;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class SellerAnalyticsService
{
    public function getDashboardMetrics(string $sellerId): array
    {
        return Cache::remember("seller.analytics.dashboard.{$sellerId}", 300, function () use ($sellerId) {
            $now = Carbon::now();

            $totalRevenue = Order::where('seller_id', $sellerId)->where('status', 'delivered')->sum('total_amount');
            $todayRevenue = Order::where('seller_id', $sellerId)->where('status', 'delivered')->whereDate('created_at', $now->toDateString())->sum('total_amount');

            $totalOrders = Order::where('seller_id', $sellerId)->count();
            $pendingOrders = Order::where('seller_id', $sellerId)->whereIn('status', ['pending_seller_approval', 'processing'])->count();

            $totalProducts = Product::where('seller_id', $sellerId)->count();
            $lowStockProducts = Product::where('seller_id', $sellerId)->where('available_quantity', '<=', 5)->count();

            $deliveredOrders = Order::where('seller_id', $sellerId)->where('status', 'delivered')->count();
            $fulfillmentRate = $totalOrders > 0 ? round(($deliveredOrders / $totalOrders) * 100, 2) : 0;

            return [
                'revenue' => [
                    'total' => $totalRevenue,
                    'today' => $todayRevenue,
                ],
                'orders' => [
                    'total' => $totalOrders,
                    'pending' => $pendingOrders,
                ],
                'products' => [
                    'total' => $totalProducts,
                    'low_stock' => $lowStockProducts,
                ],
                'fulfillment_rate' => $fulfillmentRate,
            ];
        });
    }
}
