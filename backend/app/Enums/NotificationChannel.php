<?php

declare(strict_types=1);

namespace App\Enums;

enum NotificationChannel: string
{
    case InApp = 'in_app';
    case Email = 'email';
    case Sms = 'sms';
    case WhatsApp = 'whatsapp';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
