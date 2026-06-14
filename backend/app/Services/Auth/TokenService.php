<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\User;

class TokenService
{
    public function createTokenForUser(User $user, string $deviceName = 'api_token'): string
    {
        return $user->createToken($deviceName)->plainTextToken;
    }

    public function revokeTokensForUser(User $user): void
    {
        $user->tokens()->delete();
    }

    public function revokeCurrentToken(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}
