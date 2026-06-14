<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendOtpRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\Auth\OtpService;
use App\Services\Auth\TokenService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class OtpController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected OtpService $otpService,
        protected TokenService $tokenService
    ) {}

    public function send(SendOtpRequest $request): JsonResponse
    {
        $purpose = $request->input('purpose', 'login');
        
        // In production, you would actually send SMS here via NotificationService
        // $otpCode = $this->otpService->generateOtp($request->phone, $purpose);
        $this->otpService->generateOtp($request->phone, $purpose);

        return $this->success(null, 'OTP sent successfully to ' . $request->phone);
    }

    public function verify(VerifyOtpRequest $request): JsonResponse
    {
        $purpose = $request->input('purpose', 'login');
        
        $isValid = $this->otpService->verifyOtp($request->phone, $request->otp_code, $purpose);

        if (!$isValid) {
            return $this->error('Invalid or expired OTP', 400, null, 'AUTH_003');
        }

        // Find or create user
        $user = User::firstOrCreate(
            ['phone' => $request->phone],
            ['status' => 'active']
        );

        if (!$user->hasVerifiedPhone()) {
            $user->update(['phone_verified_at' => now()]);
        }

        if (!$user->hasRole('consumer')) {
            $user->assignRole('consumer');
        }

        $token = $this->tokenService->createTokenForUser($user);

        return $this->success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'OTP verified successfully');
    }
}
