<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health Check
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'System is healthy',
        'data'    => [
            'status'    => 'ok',
            'timestamp' => now()->toIso8601ZuluString(),
        ],
        'meta'    => ['version' => '1.0']
    ]);
});

Route::get('/logs', function() {
    return file_get_contents(storage_path('logs/laravel.log'));
});

Route::prefix('v1')->middleware([\App\Http\Middleware\VisitorTrackingMiddleware::class])->group(function () {

    // Ping
    Route::get('/ping', function () {
        return response()->json([
            'success' => true,
            'message' => 'Pong',
            'data'    => ['pong' => true],
            'meta'    => ['version' => '1.0']
        ]);
    });

    // ──────────────────────────────────────────────────────────────────────────
    // Authentication Routes
    // ──────────────────────────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('/register', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'register'])->middleware('throttle:auth');
        Route::post('/login',    [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'login'])->middleware('throttle:auth');
        Route::post('/forgot-password', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'forgotPassword'])->middleware('throttle:forgot-password');
        Route::post('/reset-password',  [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'resetPassword'])->middleware('throttle:auth');

        Route::post('/otp/send',   [\App\Http\Controllers\Api\V1\Auth\OtpController::class, 'send'])->middleware('throttle:auth');
        Route::post('/otp/verify', [\App\Http\Controllers\Api\V1\Auth\OtpController::class, 'verify'])->middleware('throttle:auth');

        // Authenticated Auth Routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'logout']);
            Route::get('/me',      [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'me']);
        });
    });

    // ──────────────────────────────────────────────────────────────────────────
    // Marketplace Public Routes (no auth required)
    // ──────────────────────────────────────────────────────────────────────────
    Route::prefix('marketplace')->group(function () {
        Route::get('/categories',         [\App\Http\Controllers\Api\V1\Marketplace\CategoryController::class, 'index']);
        Route::get('/categories/{slug}',  [\App\Http\Controllers\Api\V1\Marketplace\CategoryController::class, 'show']);

        Route::get('/products',           [\App\Http\Controllers\Api\V1\Marketplace\ProductController::class, 'index']);
        Route::get('/products/featured',  [\App\Http\Controllers\Api\V1\Marketplace\ProductController::class, 'featured']);
        Route::get('/products/popular',   [\App\Http\Controllers\Api\V1\Marketplace\ProductController::class, 'popular']);
        Route::get('/products/{slug}',    [\App\Http\Controllers\Api\V1\Marketplace\ProductController::class, 'show']);

        Route::get('/search', [\App\Http\Controllers\Api\V1\Marketplace\SearchController::class, 'search']);
        Route::get('/settings', [\App\Http\Controllers\Api\V1\Marketplace\SettingController::class, 'index']);
    });

    // ──────────────────────────────────────────────────────────────────────────
    // Authenticated Consumer Routes
    // ──────────────────────────────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // Cart
        Route::prefix('cart')->group(function () {
            Route::get('/',                 [\App\Http\Controllers\Api\V1\Consumer\CartController::class, 'index']);
            Route::post('/items',           [\App\Http\Controllers\Api\V1\Consumer\CartController::class, 'addItem']);
            Route::put('/items/{id}',       [\App\Http\Controllers\Api\V1\Consumer\CartController::class, 'updateItem']);
            Route::delete('/items/{id}',    [\App\Http\Controllers\Api\V1\Consumer\CartController::class, 'removeItem']);
            Route::delete('/',              [\App\Http\Controllers\Api\V1\Consumer\CartController::class, 'clear']);
        });

        // Addresses
        Route::prefix('addresses')->group(function () {
            Route::get('/',        [\App\Http\Controllers\Api\V1\Consumer\AddressController::class, 'index']);
            Route::post('/',       [\App\Http\Controllers\Api\V1\Consumer\AddressController::class, 'store']);
            Route::put('/{id}',    [\App\Http\Controllers\Api\V1\Consumer\AddressController::class, 'update']);
            Route::delete('/{id}', [\App\Http\Controllers\Api\V1\Consumer\AddressController::class, 'destroy']);
        });

        // Orders (consumer)
        Route::prefix('orders')->group(function () {
            Route::get('/',             [\App\Http\Controllers\Api\V1\Consumer\OrderController::class, 'index']);
            Route::get('/{id}',         [\App\Http\Controllers\Api\V1\Consumer\OrderController::class, 'show']);
            Route::post('/{id}/cancel', [\App\Http\Controllers\Api\V1\Consumer\OrderController::class, 'cancel']);
        });

        // Checkout
        Route::post('/checkout', [\App\Http\Controllers\Api\V1\Consumer\OrderController::class, 'checkout']);

        // ──────────────────────────────────────────────────────────────────────
        // Seller Routes
        // ──────────────────────────────────────────────────────────────────────
        Route::prefix('seller')->middleware('role:seller|super_admin')->group(function () {

            // Products
            Route::apiResource('products', \App\Http\Controllers\Api\V1\Seller\ProductController::class);
            Route::post('products/{id}/publish',        [\App\Http\Controllers\Api\V1\Seller\ProductController::class, 'publish']);
            Route::post('products/{id}/archive',        [\App\Http\Controllers\Api\V1\Seller\ProductController::class, 'archive']);
            Route::post('products/{id}/images',         [\App\Http\Controllers\Api\V1\Seller\ProductController::class, 'uploadImage']);
            Route::delete('products/{id}/images/{imageId}', [\App\Http\Controllers\Api\V1\Seller\ProductController::class, 'deleteImage']);

            // Orders (seller view)
            Route::prefix('orders')->group(function () {
                Route::get('/',                    [\App\Http\Controllers\Api\V1\Seller\OrderController::class, 'index']);
                Route::get('/{id}',               [\App\Http\Controllers\Api\V1\Seller\OrderController::class, 'show']);
                Route::patch('/{id}/approve',     [\App\Http\Controllers\Api\V1\Seller\OrderController::class, 'approve']);
                Route::patch('/{id}/reject',      [\App\Http\Controllers\Api\V1\Seller\OrderController::class, 'reject']);
                Route::patch('/{id}/status',      [\App\Http\Controllers\Api\V1\Seller\OrderController::class, 'updateStatus']);
            });

            // Dashboard & Analytics
            Route::get('/dashboard', [\App\Http\Controllers\Api\V1\Seller\DashboardController::class, 'index']);
        });

        // ──────────────────────────────────────────────────────────────────────
        // Admin Routes
        // ──────────────────────────────────────────────────────────────────────
        Route::prefix('admin')->middleware('role:admin|super_admin')->group(function () {
            Route::get('/dashboard',  [\App\Http\Controllers\Api\V1\Admin\DashboardController::class, 'index']);
            Route::get('/consumers',  [\App\Http\Controllers\Api\V1\Admin\ConsumerController::class, 'index']);
            Route::get('/consumers/{id}', [\App\Http\Controllers\Api\V1\Admin\ConsumerController::class, 'show']);

            // Settings
            Route::get('/settings',   [\App\Http\Controllers\Api\V1\Admin\SettingController::class, 'index']);
            Route::post('/settings',  [\App\Http\Controllers\Api\V1\Admin\SettingController::class, 'update']);

            // Products
            Route::apiResource('products', \App\Http\Controllers\Api\V1\Admin\ProductController::class);
            Route::patch('/products/{id}/status', [\App\Http\Controllers\Api\V1\Admin\ProductController::class, 'updateStatus']);

            // Product Images
            Route::post('/products/{id}/images',                       [\App\Http\Controllers\Api\V1\Admin\ProductImageController::class, 'store']);
            Route::delete('/products/{id}/images/{imageId}',           [\App\Http\Controllers\Api\V1\Admin\ProductImageController::class, 'destroy']);
            Route::patch('/products/{id}/images/{imageId}/primary',    [\App\Http\Controllers\Api\V1\Admin\ProductImageController::class, 'setPrimary']);

            // Tags
            Route::apiResource('tags', \App\Http\Controllers\Api\V1\Admin\TagController::class)->except(['show']);

            // Categories
            Route::apiResource('categories', \App\Http\Controllers\Api\V1\Admin\CategoryController::class)->except(['show']);

            // All orders (operations view)
            Route::get('/orders',     [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'index']);
            Route::get('/orders/{id}', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'show']);
            Route::patch('/orders/{id}/status', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'updateStatus']);
        });
    });
});
