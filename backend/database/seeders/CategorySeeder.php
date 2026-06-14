<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Fresh Fish',
                'slug' => 'fresh-fish',
                'description' => 'Freshly caught fish delivered directly from local fishermen. Premium quality, daily catch.',
                'icon' => '🐟',
                'sort_order' => 1,
            ],
            [
                'name' => 'Sea Fish',
                'slug' => 'sea-fish',
                'description' => 'Premium ocean-caught fish including Seer Fish, Red Snapper, Kingfish, and more.',
                'icon' => '🌊',
                'sort_order' => 2,
            ],
            [
                'name' => 'River Fish',
                'slug' => 'river-fish',
                'description' => 'Farm-raised and wild-caught freshwater fish. Rohu, Katla, Tilapia, and more.',
                'icon' => '🏞️',
                'sort_order' => 3,
            ],
            [
                'name' => 'Prawns',
                'slug' => 'prawns',
                'description' => 'Tiger prawns, white prawns, and freshwater prawns. Cleaned and ready to cook.',
                'icon' => '🦐',
                'sort_order' => 4,
            ],
            [
                'name' => 'Crabs',
                'slug' => 'crabs',
                'description' => 'Live mud crabs, blue swimming crabs, and mangrove crabs. Fresh and full of flavour.',
                'icon' => '🦀',
                'sort_order' => 5,
            ],
            [
                'name' => 'Shellfish',
                'slug' => 'shellfish',
                'description' => 'Clams, mussels, oysters, and squid. Straight from the sea to your kitchen.',
                'icon' => '🦪',
                'sort_order' => 6,
            ],
            [
                'name' => 'Dry Fish',
                'slug' => 'dry-fish',
                'description' => 'Sun-dried and salt-cured fish from traditional coastal methods. Rich and flavourful.',
                'icon' => '🏖️',
                'sort_order' => 7,
            ],
            [
                'name' => 'Special Catch',
                'slug' => 'special-catch',
                'description' => 'Rare and seasonal catches. Premium selections available for a limited time.',
                'icon' => '⭐',
                'sort_order' => 8,
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insertOrIgnore([
                'id' => (string) Str::uuid(),
                'parent_id' => null,
                'name' => $category['name'],
                'slug' => $category['slug'],
                'description' => $category['description'],
                'icon' => $category['icon'],
                'image' => null,
                'sort_order' => $category['sort_order'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
