<?php

declare(strict_types=1);

namespace App\Services\Seller;

use App\Enums\ProductStatus;
use App\Models\Product;
use App\Models\User;
use App\Services\Auth\AuditLogService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductService
{
    public function __construct(
        private readonly AuditLogService $auditLogService,
        private readonly InventoryManagerService $inventoryManager
    ) {}

    public function createProduct(User $seller, array $data): Product
    {
        return DB::transaction(function () use ($seller, $data) {
            $data['slug'] = Str::slug($data['name']) . '-' . Str::random(6);
            $data['seller_id'] = $seller->id;
            
            if (!isset($data['product_status'])) {
                $data['product_status'] = ProductStatus::DRAFT->value;
            }

            $product = Product::create($data);

            if (isset($data['available_quantity']) && $data['available_quantity'] > 0) {
                $this->inventoryManager->addStock($product, (float)$data['available_quantity'], 'Initial stock', $seller->id);
            }

            $this->auditLogService->log(
                $seller,
                'PRODUCT_CREATED',
                "Product {$product->name} created."
            );

            return $product;
        });
    }

    public function updateProduct(User $seller, string $productId, array $data): Product
    {
        return DB::transaction(function () use ($seller, $productId, $data) {
            $product = Product::where('seller_id', $seller->id)->findOrFail($productId);
            $product->update($data);

            if (isset($data['available_quantity'])) {
                $diff = (float)$data['available_quantity'] - $product->available_quantity;
                if ($diff > 0) {
                    $this->inventoryManager->addStock($product, $diff, 'Manual adjustment', $seller->id);
                } elseif ($diff < 0) {
                    $this->inventoryManager->removeStock($product, abs($diff), 'Manual adjustment', $seller->id);
                }
            }

            $this->auditLogService->log(
                $seller,
                'PRODUCT_UPDATED',
                "Product {$product->name} updated."
            );

            return $product;
        });
    }

    public function publishProduct(User $seller, string $productId): Product
    {
        $product = Product::where('seller_id', $seller->id)->findOrFail($productId);
        $product->update(['product_status' => ProductStatus::PUBLISHED->value]);

        $this->auditLogService->log(
            $seller,
            'PRODUCT_PUBLISHED',
            "Product {$product->name} published."
        );

        return $product;
    }

    public function archiveProduct(User $seller, string $productId): Product
    {
        $product = Product::where('seller_id', $seller->id)->findOrFail($productId);
        $product->update(['product_status' => ProductStatus::ARCHIVED->value]);

        $this->auditLogService->log(
            $seller,
            'PRODUCT_ARCHIVED',
            "Product {$product->name} archived."
        );

        return $product;
    }

    public function deleteProduct(User $seller, string $productId): void
    {
        $product = Product::where('seller_id', $seller->id)->findOrFail($productId);
        $product->delete();

        $this->auditLogService->log(
            $seller,
            'PRODUCT_DELETED',
            "Product {$product->name} soft deleted."
        );
    }
}
