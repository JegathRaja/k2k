<?php

namespace App\Services\Analytics;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class AdminAnalyticsService
{
    public function getDashboardMetrics(): array
    {
        $metrics = Cache::remember('admin.analytics.dashboard', 5, function () {
            $now = Carbon::now();

            $totalRevenue = Order::where('status', 'delivered')->sum('total');
            $todayRevenue = Order::where('status', 'delivered')->whereDate('created_at', $now->toDateString())->sum('total');
            $weeklyRevenue = Order::where('status', 'delivered')->whereBetween('created_at', [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()])->sum('total');
            $monthlyRevenue = Order::where('status', 'delivered')->whereBetween('created_at', [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()])->sum('total');

            $ordersToday = Order::whereDate('created_at', $now->toDateString())->count();
            $ordersThisWeek = Order::whereBetween('created_at', [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()])->count();
            $ordersThisMonth = Order::whereBetween('created_at', [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()])->count();

            $totalConsumers = User::role('consumer')->count();
            $totalSellers = User::role('seller')->count();

            $activeProducts = Product::where('product_status', 'PUBLISHED')->count();
            $lowStockProducts = Product::where('available_quantity', '<=', 5)->count();

            $topCategories = Category::withCount('products')->orderBy('products_count', 'desc')->take(5)->get();
            $topSellers = User::role('seller')->withCount('sellerOrders')->orderBy('seller_orders_count', 'desc')->take(5)->get();
            $topProducts = Product::orderBy('view_count', 'desc')->take(5)->get();

            $recentOrders = Order::with('consumer')
                ->latest()
                ->take(10)
                ->get();

            return [
                'total_users' => $totalConsumers,
                'total_sellers' => $totalSellers,
                'total_products' => $activeProducts,
                'total_orders' => Order::count(),
                'recent_orders' => $recentOrders,
                'revenue' => [
                    'total' => $totalRevenue,
                    'today' => $todayRevenue,
                    'weekly' => $weeklyRevenue,
                    'monthly' => $monthlyRevenue,
                ],
                'orders' => [
                    'today' => $ordersToday,
                    'weekly' => $ordersThisWeek,
                    'monthly' => $ordersThisMonth,
                ],
                'users' => [
                    'consumers' => $totalConsumers,
                    'sellers' => $totalSellers,
                ],
                'products' => [
                    'active' => $activeProducts,
                    'low_stock' => $lowStockProducts,
                ],
                'top' => [
                    'categories' => $topCategories,
                    'sellers' => $topSellers,
                    'products' => $topProducts,
                ]
            ];
        });

        // Add live activity log feed
        $metrics['recent_activity'] = \App\Models\AuditLog::with(['user.roles'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($log) {
                $userName = $log->user ? (trim($log->user->first_name . ' ' . $log->user->last_name)) : 'Unknown User';
                $roleName = $log->user && $log->user->roles->first() ? $log->user->roles->first()->name : 'customer';
                
                if ($roleName === 'consumer') {
                    $roleName = 'customer';
                }

                $description = '';
                if ($log->action === 'login') {
                    $description = "{$userName} ({$roleName}) has logged in";
                } elseif ($log->action === 'registration') {
                    $description = "{$userName} has registered as a new {$roleName}";
                } elseif ($log->action === 'failed_login') {
                    $description = "Failed login attempt for {$userName}";
                } elseif ($log->action === 'logout') {
                    $description = "{$userName} ({$roleName}) has logged out";
                } else {
                    $description = "{$userName} performed: " . str_replace('_', ' ', $log->action);
                }

                return [
                    'id' => $log->id,
                    'user_name' => $userName,
                    'role' => $roleName,
                    'action' => $log->action,
                    'description' => $description,
                    'created_at' => $log->created_at ? $log->created_at->toIso8601String() : null,
                ];
            })
            ->toArray();

        return $metrics;
    }
}
