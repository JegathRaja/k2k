<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitorAnalytics extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'ip_hash',
        'user_agent',
        'device_type',
        'visit_date',
        'user_id',
        'is_registered',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'is_registered' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
