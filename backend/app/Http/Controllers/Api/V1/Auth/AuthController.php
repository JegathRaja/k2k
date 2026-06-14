<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(Request $request): JsonResponse
    {
        // Ideally this should be a FormRequest, but using simple validation here for brevity
        $validated = $request->validate([
            'first_name'     => 'required|string|min:2|max:50',
            'last_name'      => 'nullable|string|max:50',
            'email'          => 'required|email|unique:users',
            'password'       => ['required', 'string', 'confirmed', \Illuminate\Validation\Rules\Password::min(8)->mixedCase()->numbers()],
            'contact_number' => 'required|string|max:15|unique:users',
            'state'          => 'required|string',
            'district'       => 'required|string',
            'pincode'        => 'nullable|string',
        ]);

        $user = $this->authService->registerConsumer(
            $validated, 
            $request->ip(), 
            $request->userAgent()
        );

        return $this->successResponse($user, 'Registration successful', 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = $this->authService->login(
            $request->email, 
            $request->password, 
            $request->ip(), 
            $request->userAgent()
        );

        if (!$user) {
            return $this->errorResponse('Invalid credentials or inactive account', 401);
        }

        $user->load(['roles', 'permissions', 'sellerProfile']);
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'user' => $user,
            'token' => $token
        ], 'Login successful');
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout(
            $request->user(),
            $request->ip(),
            $request->userAgent()
        );
        return $this->successResponse(null, 'Logged out successfully');
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);
        
        $status = $this->authService->sendResetLink($request->email);
        
        if ($status === 'success') {
            return $this->successResponse(null, 'Password reset link sent');
        }

        return $this->errorResponse('Failed to send reset link', 400);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
            'token' => 'required|string',
        ]);

        $status = $this->authService->resetPassword(
            $validated,
            $request->ip(),
            $request->userAgent()
        );

        if ($status === 'success') {
            return $this->successResponse(null, 'Password has been reset');
        }

        return $this->errorResponse('Failed to reset password', 400);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['consumerProfile', 'sellerProfile', 'roles', 'permissions']);
        return $this->successResponse($user, 'User profile retrieved');
    }
}
