<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Marketplace;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    use ApiResponse;

    /**
     * Get all public settings (e.g., footer settings, contact info, brand details).
     */
    public function index(): JsonResponse
    {
        $settings = Setting::where('is_public', true)
            ->get()
            ->keyBy('key')
            ->map(fn($setting) => $setting->value);

        return $this->successResponse($settings, 'Public settings retrieved');
    }
}
