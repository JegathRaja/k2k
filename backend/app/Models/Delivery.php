<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\DeliveryStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Delivery extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'order_id',
        'partner_id',
        'status',
        'pickup_address',
        'delivery_address',
        'distance_km',
        'estimated_minutes',
        'assigned_at',
        'picked_up_at',
        'delivered_at',
        'delivery_proof',
        'tracking_url',
    ];

    protected function casts(): array
    {
        return [
            'status' => DeliveryStatus::class,
            'distance_km' => 'decimal:2',
            'estimated_minutes' => 'integer',
            'assigned_at' => 'datetime',
            'picked_up_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function partner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'partner_id');
    }
}
