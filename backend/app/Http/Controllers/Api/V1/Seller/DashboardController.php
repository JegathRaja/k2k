<?php

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Analytics\SellerAnalyticsService;

class DashboardController extends Controller
{
    protected SellerAnalyticsService $analyticsService;

    public function __construct(SellerAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function index(Request $request)
    {
        $seller = $request->user();
        $metrics = $this->analyticsService->getDashboardMetrics($seller->id);

        return response()->json([
            'success' => true,
            'message' => 'Seller dashboard metrics retrieved',
            'data'    => $metrics,
        ]);
    }
}
