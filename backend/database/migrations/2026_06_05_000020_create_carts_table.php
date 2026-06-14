<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('consumer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status', 50)->default('ACTIVE'); // ACTIVE, ABANDONED, CONVERTED_TO_ORDER
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->integer('total_items')->default(0);
            $table->timestamps();

            $table->index('consumer_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
