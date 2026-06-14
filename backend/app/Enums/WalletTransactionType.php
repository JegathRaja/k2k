<?php

declare(strict_types=1);

namespace App\Enums;

enum WalletTransactionType: string
{
    case Credit = 'credit';
    case Debit = 'debit';
    case Reserve = 'reserve';
    case Release = 'release';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
