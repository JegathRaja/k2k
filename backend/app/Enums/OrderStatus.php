<?php

declare(strict_types=1);

namespace App\Enums;

enum OrderStatus: string
{
    case PendingSellerApproval = 'pending_seller_approval';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Processing = 'processing';
    case ReadyForDelivery = 'ready_for_delivery';
    case OutForDelivery = 'out_for_delivery';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match($this) {
            self::PendingSellerApproval => 'Pending Seller Approval',
            self::Approved => 'Approved',
            self::Rejected => 'Rejected',
            self::Processing => 'Processing',
            self::ReadyForDelivery => 'Ready For Delivery',
            self::OutForDelivery => 'Out For Delivery',
            self::Delivered => 'Delivered',
            self::Cancelled => 'Cancelled',
            self::Refunded => 'Refunded',
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::Delivered, self::Cancelled, self::Refunded, self::Rejected]);
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
