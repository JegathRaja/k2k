<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => 'required|string|max:15',
            'otp_code' => 'required|string|size:6',
            'purpose' => 'nullable|string|in:login,register,verify',
        ];
    }
}
