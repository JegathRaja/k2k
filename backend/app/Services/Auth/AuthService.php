<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\User;
use App\Models\ConsumerProfile;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\PasswordReset;
use Exception;

class AuthService
{
    public function __construct(
        protected AuditLogService $auditLogService
    ) {}

    public function registerConsumer(array $data, ?string $ip = null, ?string $userAgent = null): User
    {
        return DB::transaction(function () use ($data, $ip, $userAgent) {
            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'] ?? null,
                'email' => $data['email'],
                'contact_number' => $data['contact_number'],
                'state' => $data['state'] ?? null,
                'district' => $data['district'] ?? null,
                'pincode' => $data['pincode'] ?? null,
                'password' => Hash::make($data['password']),
                'status' => 'active',
            ]);

            // Create Consumer Profile
            ConsumerProfile::create([
                'user_id' => $user->id,
            ]);

            // Assign role
            // Assuming Spatie Roles uses the enum value
            $user->assignRole(UserRole::Consumer->value);

            // Audit log
            $this->auditLogService->log($user->id, 'registration', 'Consumer registered successfully', $ip, $userAgent);

            event(new Registered($user));

            return $user;
        });
    }

    public function login(string $email, string $password, ?string $ip = null, ?string $userAgent = null): ?User
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password) || !$user->isActive()) {
            if ($user) {
                $this->auditLogService->log($user->id, 'failed_login', 'Failed login attempt', $ip, $userAgent);
            }
            return null;
        }

        // Update timestamps
        $user->last_login_at = now();
        $user->save();

        if ($user->consumerProfile) {
            $user->consumerProfile->increment('total_logins');
        }

        $this->auditLogService->log($user->id, 'login', 'User logged in', $ip, $userAgent);

        event(new Login('sanctum', $user, false));

        return $user;
    }

    public function logout(User $user, ?string $ip = null, ?string $userAgent = null): void
    {
        $user->currentAccessToken()->delete();
        $this->auditLogService->log($user->id, 'logout', 'User logged out', $ip, $userAgent);
        event(new Logout('sanctum', $user));
    }

    public function sendResetLink(string $email): string
    {
        $status = Password::sendResetLink(['email' => $email]);
        return $status === Password::RESET_LINK_SENT ? 'success' : 'failed';
    }

    public function resetPassword(array $data, ?string $ip = null, ?string $userAgent = null): string
    {
        $status = Password::reset(
            $data,
            function ($user, $password) use ($ip, $userAgent) {
                $user->password = Hash::make($password);
                $user->save();
                $this->auditLogService->log($user->id, 'password_reset', 'User reset their password', $ip, $userAgent);
                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET ? 'success' : 'failed';
    }
}
