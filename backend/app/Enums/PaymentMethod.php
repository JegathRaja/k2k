<?php

declare(strict_types=1);

namespace App\Enums;

enum PaymentMethod: string
{
    case Razorpay = 'razorpay';
    case Wallet = 'wallet';
    case CashOnDelivery = 'cod';

    public function label(): string
    {
        return match($this) {
            self::Razorpay => 'Razorpay',
            self::Wallet => 'Wallet',
            self::CashOnDelivery => 'Cash on Delivery',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
