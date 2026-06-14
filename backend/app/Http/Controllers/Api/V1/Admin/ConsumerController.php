<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ConsumerAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;

class ConsumerController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ConsumerAnalyticsService $analyticsService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = User::role('consumer')->with('consumerProfile');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('contact_number', 'like', "%{$search}%");
            });
        }

        $totalConsumers = User::role('consumer')->count();
        $totalLoggedInConsumers = User::role('consumer')
            ->whereHas('consumerProfile', function ($q) {
                $q->where('total_logins', '>', 0);
            })
            ->count();

        $consumers = $query->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Consumers retrieved successfully',
            'data'    => $consumers,
            'meta'    => [
                'total_consumers' => $totalConsumers,
                'total_logged_in_consumers' => $totalLoggedInConsumers,
            ]
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $user = User::role('consumer')->with('consumerProfile')->findOrFail($id);
        $analytics = $this->analyticsService->getConsumerMetrics($id);

        return $this->successResponse([
            'user' => $user,
            'analytics' => $analytics,
        ], 'Consumer details retrieved');
    }

    public function dashboard(): JsonResponse
    {
        $metrics = $this->analyticsService->getDashboardMetrics();
        return $this->successResponse($metrics, 'Dashboard metrics retrieved');
    }
}
