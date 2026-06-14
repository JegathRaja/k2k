<?php

declare(strict_types=1);

namespace App\Services\Seller;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CustomerManagementService
{
    public function getCustomersForSeller(string $sellerId, int $perPage = 15)
    {
        // Get all unique consumers who ordered from this seller, along with their aggregate stats
        return Order::where('seller_id', $sellerId)
            ->select('consumer_id', DB::raw('COUNT(id) as total_orders'), DB::raw('SUM(total) as lifetime_value'), DB::raw('MAX(created_at) as last_purchase_date'))
            ->groupBy('consumer_id')
            ->with('consumer') // Assumes relationship exists in Order model
            ->paginate($perPage);
    }

    public function getCustomerDetails(string $sellerId, string $consumerId): array
    {
        $orders = Order::where('seller_id', $sellerId)
            ->where('consumer_id', $consumerId)
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total_orders' => $orders->count(),
            'lifetime_value' => $orders->sum('total'),
            'average_order_value' => $orders->count() > 0 ? $orders->sum('total') / $orders->count() : 0,
            'last_purchase' => $orders->first()?->created_at,
        ];

        return [
            'consumer' => User::find($consumerId),
            'stats' => $stats,
            'recent_orders' => $orders->take(5),
        ];
    }
}
