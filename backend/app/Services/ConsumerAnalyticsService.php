<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ConsumerProfile;
use App\Models\User;
use Carbon\Carbon;

class ConsumerAnalyticsService
{
    public function getConsumerMetrics(string $consumerId): array
    {
        $profile = ConsumerProfile::where('user_id', $consumerId)->firstOrFail();
        $user = User::findOrFail($consumerId);

        $daysSinceRegistration = Carbon::parse($user->created_at)->diffInDays(now());
        
        return [
            'lifetime_orders' => $profile->lifetime_orders,
            'lifetime_spending' => (float) $profile->lifetime_spending,
            'last_login' => $user->last_login_at,
            'login_count' => $profile->total_logins,
            'registration_date' => $user->created_at,
            'days_since_registration' => $daysSinceRegistration,
            'average_order_value' => $profile->lifetime_orders > 0 ? ($profile->lifetime_spending / $profile->lifetime_orders) : 0,
        ];
    }
    
    public function getDashboardMetrics(): array
    {
        $today = now()->startOfDay();
        $startOfWeek = now()->startOfWeek();
        $startOfMonth = now()->startOfMonth();

        // Needs to join model_has_roles to filter purely consumers, 
        // but for now relying on the consumer_profiles existence is a strong proxy.
        $totalConsumers = ConsumerProfile::count();
        
        $newToday = User::whereHas('consumerProfile')->where('created_at', '>=', $today)->count();
        $newThisWeek = User::whereHas('consumerProfile')->where('created_at', '>=', $startOfWeek)->count();
        $newThisMonth = User::whereHas('consumerProfile')->where('created_at', '>=', $startOfMonth)->count();
        
        $activeConsumers = ConsumerProfile::where('last_visit_at', '>=', now()->subDays(30))->count();

        return [
            'total_consumers' => $totalConsumers,
            'new_today' => $newToday,
            'new_this_week' => $newThisWeek,
            'new_this_month' => $newThisMonth,
            'active_consumers' => $activeConsumers,
        ];
    }
}
