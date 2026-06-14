<?php

declare(strict_types=1);

namespace App\Services\Auth;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AuditLogService
{
    /**
     * Record an audit log entry.
     *
     * The audit_logs table schema:
     *   id, user_id, action, model_type, model_id,
     *   old_values, new_values, ip_address, user_agent, created_at
     *
     * Note: There is NO "description" or "updated_at" column.
     */
    public function log(
        string $userId,
        string $action,
        string $description = '',  // ignored — kept for backward compat with callers
        ?string $ipAddress = null,
        ?string $userAgent = null,
        ?string $modelType = null,
        ?string $modelId = null,
        ?array $oldValues = null,
        ?array $newValues = null,
    ): void {
        DB::table('audit_logs')->insert([
            'id'         => (string) Str::uuid(),
            'user_id'    => $userId,
            'action'     => $action,
            'model_type' => $modelType,
            'model_id'   => $modelId,
            'old_values' => $oldValues ? json_encode($oldValues) : null,
            'new_values' => $newValues ? json_encode($newValues) : null,
            'ip_address' => $ipAddress ?? '127.0.0.1',
            'user_agent' => $userAgent,
            'created_at' => now(),
        ]);
    }
}
