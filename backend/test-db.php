<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

$tables = ['sessions', 'cache', 'cache_locks', 'jobs', 'users'];
foreach ($tables as $table) {
    echo "$table exists: " . (Schema::hasTable($table) ? "YES" : "NO") . "\n";
}
