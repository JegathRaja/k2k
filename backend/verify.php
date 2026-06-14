<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Product;
use App\Models\User;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Address;
use Illuminate\Support\Facades\DB;
use App\Services\Inventory\InventoryService;

echo "--- SECTION 1: DATABASE CONNECTION ---\n";
try {
    DB::connection()->getPdo();
    echo "Database connected successfully.\n";
} catch (\Exception $e) {
    echo "Could not connect to the database. " . $e->getMessage() . "\n";
}

echo "--- SECTION 3 & 4: INVENTORY AND TRANSACTION ROLLBACK ---\n";
// Create dummy data
try {
    $seller = User::factory()->create();
    $consumer = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $consumer->id]);

    $product = Product::factory()->create([
        'seller_id' => $seller->id,
        'available_quantity' => 10,
        'reserved_quantity' => 0,
        'stock_status' => 'IN_STOCK'
    ]);

    $cart = Cart::create(['consumer_id' => $consumer->id, 'status' => 'ACTIVE']);
    CartItem::create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'seller_id' => $seller->id,
        'quantity' => 2,
        'unit_price' => 100,
        'total_price' => 200
    ]);

    echo "Initial Product Inventory: {$product->available_quantity} available, {$product->reserved_quantity} reserved\n";

    // Simulate Checkout with forced failure
    DB::beginTransaction();
    try {
        $inventoryService = new InventoryService();
        $inventoryService->reserveStock($product, 2);
        
        echo "After Reservation (inside txn): {$product->available_quantity} available, {$product->reserved_quantity} reserved\n";

        // Force a failure
        throw new \Exception("Simulated exception during checkout (e.g., payment failed)");

        DB::commit();
    } catch (\Exception $e) {
        DB::rollBack();
        echo "Transaction Failed and Rolled Back: " . $e->getMessage() . "\n";
    }

    $product->refresh();
    echo "Product Inventory After Rollback: {$product->available_quantity} available, {$product->reserved_quantity} reserved\n";

} catch (\Exception $e) {
    echo "Test setup failed: " . $e->getMessage() . "\n";
}

echo "--- SECTION 6: QUEUE NOTIFICATIONS ---\n";
use App\Notifications\OrderCreatedNotification;
use App\Models\Order;
try {
    $order = Order::factory()->create(['seller_id' => $seller->id, 'consumer_id' => $consumer->id]);
    $seller->notify(new OrderCreatedNotification($order));
    echo "Dispatched OrderCreatedNotification to queue.\n";
    $queued = DB::table('jobs')->count();
    echo "Jobs in queue: $queued\n";
} catch (\Exception $e) {
    echo "Queue test failed: " . $e->getMessage() . "\n";
}

