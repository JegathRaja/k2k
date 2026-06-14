<?php

namespace App\Services\Inventory;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Exception;

class InventoryService
{
    /**
     * Reserve stock when an order is placed.
     */
    public function reserveStock(Product $product, float $quantity): void
    {
        if ($product->available_quantity < $quantity) {
            throw new Exception("Insufficient stock for {$product->name}");
        }

        $product->available_quantity -= $quantity;
        $product->reserved_quantity += $quantity;
        
        if ($product->available_quantity <= 0) {
            $product->stock_status = 'OUT_OF_STOCK';
        }

        $product->save();
        
        // Log transaction (assuming InventoryTransaction model exists)
        // DB::table('inventory_transactions')->insert([...]);
    }

    /**
     * Fulfill reserved stock when an order is completed/delivered.
     */
    public function fulfillStock(Product $product, float $quantity): void
    {
        if ($product->reserved_quantity < $quantity) {
            throw new Exception("Cannot fulfill more than reserved quantity for {$product->name}");
        }

        $product->reserved_quantity -= $quantity;
        $product->save();
    }

    /**
     * Release reserved stock back to available when an order is cancelled.
     */
    public function releaseStock(Product $product, float $quantity): void
    {
        $product->reserved_quantity -= $quantity;
        $product->available_quantity += $quantity;

        if ($product->available_quantity > 0 && $product->stock_status === 'OUT_OF_STOCK') {
            $product->stock_status = 'IN_STOCK';
        }

        $product->save();
    }

    /**
     * Add new stock (seller action).
     */
    public function addStock(Product $product, float $quantity): void
    {
        $product->available_quantity += $quantity;
        
        if ($product->available_quantity > 0 && $product->stock_status === 'OUT_OF_STOCK') {
            $product->stock_status = 'IN_STOCK';
        }

        $product->save();
    }
}
