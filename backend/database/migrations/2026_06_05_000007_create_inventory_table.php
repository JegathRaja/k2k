<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('product_id')->unique()->constrained()->cascadeOnDelete();
            $table->decimal('quantity', 10, 3)->default(0);
            $table->decimal('reserved_quantity', 10, 3)->default(0);
            $table->decimal('available_quantity', 10, 3)->storedAs('quantity - reserved_quantity');
            $table->decimal('low_stock_threshold', 10, 3)->default(1);
            $table->timestamps();

            $table->index('quantity');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};
