<?php

declare(strict_types=1);

namespace App\Services\Marketplace;

use App\Models\Inventory;
use Illuminate\Support\Facades\DB;
use Exception;

class InventoryService
{
    public function reserveInventory(string $productId, float|int $quantity): bool
    {
        return DB::transaction(function () use ($productId, $quantity) {
            $inventory = Inventory::where('product_id', $productId)->lockForUpdate()->firstOrFail();

            if ($inventory->available_quantity < $quantity) {
                throw new Exception("Not enough available inventory for product {$productId}.");
            }

            $inventory->reserved_quantity += $quantity;
            $inventory->save();

            // event(new \App\Events\InventoryReserved($inventory));

            return true;
        });
    }

    public function commitReservation(string $productId, float|int $quantity): bool
    {
        return DB::transaction(function () use ($productId, $quantity) {
            $inventory = Inventory::where('product_id', $productId)->lockForUpdate()->firstOrFail();

            if ($inventory->reserved_quantity < $quantity) {
                throw new Exception("Not enough reserved inventory to commit for product {$productId}.");
            }

            $inventory->quantity -= $quantity;
            $inventory->reserved_quantity -= $quantity;
            $inventory->save();

            return true;
        });
    }

    public function releaseInventory(string $productId, float|int $quantity): bool
    {
        return DB::transaction(function () use ($productId, $quantity) {
            $inventory = Inventory::where('product_id', $productId)->lockForUpdate()->firstOrFail();

            if ($inventory->reserved_quantity < $quantity) {
                throw new Exception("Attempting to release more inventory than reserved for product {$productId}.");
            }

            $inventory->reserved_quantity -= $quantity;
            $inventory->save();

            // event(new \App\Events\InventoryReleased($inventory));

            return true;
        });
    }
}
