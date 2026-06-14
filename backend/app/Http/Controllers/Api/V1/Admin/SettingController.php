<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    use ApiResponse;

    /**
     * Get all settings.
     */
    public function index(): JsonResponse
    {
        $settings = Setting::all()->keyBy('key')->map(fn($setting) => $setting->value);
        
        return $this->successResponse($settings, 'Settings retrieved');
    }

    /**
     * Update settings in bulk.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable', // Values can be string, null, arrays, etc. depending on json
        ]);

        foreach ($validated['settings'] as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $value,
                    // If it's a footer setting, mark it public. Ideally we manage this via config or explicit passing, 
                    // but we can default new settings to is_public=true if they start with 'footer_'
                    'is_public' => str_starts_with($key, 'footer_') || str_starts_with($key, 'site_'),
                ]
            );
        }

        $updatedSettings = Setting::all()->keyBy('key')->map(fn($setting) => $setting->value);

        return $this->successResponse($updatedSettings, 'Settings updated successfully');
    }
}
