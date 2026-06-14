<?php

declare(strict_types=1);

namespace App\Enums;

enum StockStatus: string
{
    case IN_STOCK = 'IN_STOCK';
    case LOW_STOCK = 'LOW_STOCK';
    case OUT_OF_STOCK = 'OUT_OF_STOCK';
    case PREORDER = 'PREORDER';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
