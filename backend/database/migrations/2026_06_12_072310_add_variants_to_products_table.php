<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // JSON array of variant option names e.g. ["Frozen", "Cut", "Cleaned", "Live"]
            $table->json('variants')->nullable()->after('is_popular');
            // Short description if not already used
            $table->string('short_description', 500)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('variants');
        });
    }
};
