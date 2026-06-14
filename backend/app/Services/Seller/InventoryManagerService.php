<?php

declare(strict_types=1);

namespace App\Services\Seller;

use App\Enums\StockStatus;
use App\Models\InventoryTransaction;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class InventoryManagerService
{
    public function addStock(Product $product, float $amount, string $reason, ?string $userId = null): void
    {
        DB::transaction(function () use ($product, $amount, $reason, $userId) {
            $before = $product->available_quantity;
            $product->increment('available_quantity', $amount);
            $after = $product->available_quantity;

            $this->updateStockStatus($product);

            InventoryTransaction::create([
                'product_id' => $product->id,
                'transaction_type' => 'STOCK_ADDED',
                'quantity_before' => $before,
                'quantity_after' => $after,
                'quantity_changed' => $amount,
                'reason' => $reason,
                'created_by' => $userId,
            ]);
        });
    }

    public function removeStock(Product $product, float $amount, string $reason, ?string $userId = null): void
    {
        DB::transaction(function () use ($product, $amount, $reason, $userId) {
            if ($product->available_quantity < $amount) {
                throw new \Exception("Insufficient available stock to remove.");
            }

            $before = $product->available_quantity;
            $product->decrement('available_quantity', $amount);
            $after = $product->available_quantity;

            $this->updateStockStatus($product);

            InventoryTransaction::create([
                'product_id' => $product->id,
                'transaction_type' => 'STOCK_REMOVED',
                'quantity_before' => $before,
                'quantity_after' => $after,
                'quantity_changed' => -$amount,
                'reason' => $reason,
                'created_by' => $userId,
            ]);
        });
    }

    private function updateStockStatus(Product $product): void
    {
        $status = StockStatus::IN_STOCK->value;
        if ($product->available_quantity <= 0) {
            $status = StockStatus::OUT_OF_STOCK->value;
        } elseif ($product->available_quantity <= 5) { // Assuming 5 is a low stock threshold for now
            $status = StockStatus::LOW_STOCK->value;
        }
        $product->update(['stock_status' => $status]);
    }
}
