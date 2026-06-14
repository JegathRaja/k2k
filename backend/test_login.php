<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'k2k-admin@gmail.com')->first();
if (!$user) {
    echo "User not found\n";
} else {
    $hash = $user->getAttributes()['password'];
    echo "Hash matches: " . (\Illuminate\Support\Facades\Hash::check('admin123', $hash) ? 'yes' : 'no') . "\n";
}
