<?php

declare(strict_types=1);

namespace App\Services\Seller;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    public function getSellerKpis(string $sellerId): array
    {
        return Cache::remember("seller.kpis.{$sellerId}", 300, function () use ($sellerId) {
            return [
                'total_consumers' => $this->getTotalConsumers($sellerId),
                'total_orders' => $this->getTotalOrders($sellerId),
                'pending_orders' => $this->getOrdersByStatus($sellerId, 'pending_seller_approval'),
                'approved_orders' => $this->getOrdersByStatus($sellerId, 'approved'),
                'processing_orders' => $this->getOrdersByStatus($sellerId, 'processing'),
                'delivered_orders' => $this->getOrdersByStatus($sellerId, 'delivered'),
                'cancelled_orders' => $this->getOrdersByStatus($sellerId, 'cancelled'),
                'todays_revenue' => $this->getRevenue($sellerId, 'today'),
                'weekly_revenue' => $this->getRevenue($sellerId, 'week'),
                'monthly_revenue' => $this->getRevenue($sellerId, 'month'),
                'lifetime_revenue' => $this->getRevenue($sellerId, 'lifetime'),
            ];
        });
    }

    protected function getTotalConsumers(string $sellerId): int
    {
        return Order::where('seller_id', $sellerId)->distinct('consumer_id')->count('consumer_id');
    }

    protected function getTotalOrders(string $sellerId): int
    {
        return Order::where('seller_id', $sellerId)->count();
    }

    protected function getOrdersByStatus(string $sellerId, string $status): int
    {
        return Order::where('seller_id', $sellerId)->where('status', $status)->count();
    }

    protected function getRevenue(string $sellerId, string $period): float
    {
        $query = Order::where('seller_id', $sellerId)->where('status', 'delivered');
        
        if ($period === 'today') {
            $query->whereDate('created_at', today());
        } elseif ($period === 'week') {
            $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
        } elseif ($period === 'month') {
            $query->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year);
        }

        return (float) $query->sum('total');
    }
}
