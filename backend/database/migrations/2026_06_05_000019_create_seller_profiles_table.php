<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seller_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('shop_name', 255);
            $table->string('shop_logo')->nullable();
            $table->string('shop_banner')->nullable();
            $table->text('description')->nullable();
            $table->string('seller_status', 50)->default('PENDING'); // PENDING, ACTIVE, SUSPENDED, REJECTED
            $table->string('gst_number', 50)->nullable();
            $table->text('business_address')->nullable();
            $table->string('bank_account_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('ifsc_code', 20)->nullable();
            $table->string('upi_id', 100)->nullable();
            $table->timestamps();
            
            $table->index('seller_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seller_profiles');
    }
};
