<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Role;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRolesIfTableExists();
    }

    /**
     * Seed the Spatie roles required by tests.
     * Only runs if the roles table exists (i.e., migrations have run).
     */
    protected function seedRolesIfTableExists(): void
    {
        try {
            if (!Schema::hasTable('roles')) {
                return;
            }

            $roles = [
                'super_admin',
                'admin',
                'seller',
                'seller_staff',
                'consumer',
                'operations_manager',
                'regional_manager',
                'finance_manager',
                'support_agent',
            ];

            foreach ($roles as $role) {
                Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
            }

            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        } catch (\Exception $e) {
            // Table doesn't exist yet — safe to ignore during non-database tests
        }
    }
}
