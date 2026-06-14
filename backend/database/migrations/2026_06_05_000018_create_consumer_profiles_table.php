<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consumer_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignUuid('preferred_delivery_address_id')->nullable()->constrained('addresses')->nullOnDelete();
            $table->integer('loyalty_points')->default(0);
            $table->integer('lifetime_orders')->default(0);
            $table->decimal('lifetime_spending', 12, 2)->default(0);
            $table->integer('total_logins')->default(0);
            $table->timestamp('last_order_date')->nullable();
            $table->timestamp('last_visit_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consumer_profiles');
    }
};
