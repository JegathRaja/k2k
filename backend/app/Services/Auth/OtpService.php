<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\Otp;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class OtpService
{
    public function generateOtp(string $phone, string $purpose = 'login'): string
    {
        // Cancel any existing pending OTPs for this phone and purpose
        Otp::where('phone', $phone)
            ->where('purpose', $purpose)
            ->whereNull('verified_at')
            ->update(['verified_at' => now()]); // or delete them

        $otpCode = (string) random_int(100000, 999999);

        Otp::create([
            'phone' => $phone,
            'otp_hash' => Hash::make($otpCode),
            'purpose' => $purpose,
            'expires_at' => now()->addMinutes(10),
        ]);

        return $otpCode;
    }

    public function verifyOtp(string $phone, string $otpCode, string $purpose = 'login'): bool
    {
        $otp = Otp::where('phone', $phone)
            ->where('purpose', $purpose)
            ->whereNull('verified_at')
            ->where('expires_at', '>', now())
            ->orderByDesc('created_at')
            ->first();

        if (!$otp) {
            return false;
        }

        if ($otp->hasExceededAttempts()) {
            return false;
        }

        if (Hash::check($otpCode, $otp->otp_hash)) {
            $otp->update(['verified_at' => now()]);
            return true;
        }

        $otp->increment('attempts');
        return false;
    }
}
