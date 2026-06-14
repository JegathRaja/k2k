<?php

declare(strict_types=1);

namespace App\Enums;

enum ProductStatus: string
{
    case DRAFT = 'DRAFT';
    case PENDING_REVIEW = 'PENDING_REVIEW';
    case PUBLISHED = 'PUBLISHED';
    case OUT_OF_STOCK = 'OUT_OF_STOCK';
    case ARCHIVED = 'ARCHIVED';
    case DISABLED = 'DISABLED';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
