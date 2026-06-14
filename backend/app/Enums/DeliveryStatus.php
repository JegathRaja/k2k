<?php

declare(strict_types=1);

namespace App\Enums;

enum DeliveryStatus: string
{
    case Unassigned = 'unassigned';
    case Assigned = 'assigned';
    case PickedUp = 'picked_up';
    case InTransit = 'in_transit';
    case Delivered = 'delivered';
    case Failed = 'failed';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
