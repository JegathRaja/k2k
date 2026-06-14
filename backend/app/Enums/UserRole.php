<?php

declare(strict_types=1);

namespace App\Enums;

enum UserRole: string
{
    case SuperAdmin = 'super_admin';
    case Admin = 'admin';
    case Consumer = 'consumer';
    case Seller = 'seller';
    case Fisherman = 'fisherman';
    case DeliveryPartner = 'delivery_partner';

    public function label(): string
    {
        return match($this) {
            self::SuperAdmin => 'Super Administrator',
            self::Admin => 'Administrator',
            self::Consumer => 'Consumer',
            self::Seller => 'Seller',
            self::Fisherman => 'Fisherman',
            self::DeliveryPartner => 'Delivery Partner',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
