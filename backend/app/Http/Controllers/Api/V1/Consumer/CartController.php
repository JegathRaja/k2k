<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Consumer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use ApiResponse;

    /**
     * Get the current user's active cart with items.
     */
    public function index(Request $request): JsonResponse
    {
        $cart = $this->getOrCreateCart($request->user()->id);
        $cart->load(['items.product.images', 'items.product.category']);

        return $this->successResponse($this->formatCart($cart), 'Cart retrieved');
    }

    /**
     * Add an item to the cart.
     */
    public function addItem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|uuid|exists:products,id',
            'quantity'   => 'required|numeric|min:0.001',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if ($product->available_quantity < $validated['quantity']) {
            return $this->errorResponse(
                "Only {$product->available_quantity} {$product->weight_unit} available",
                422
            );
        }

        $cart = $this->getOrCreateCart($request->user()->id);

        // Check if product already in cart
        $existing = $cart->items()->where('product_id', $product->id)->first();

        if ($existing) {
            $newQty = $existing->quantity + $validated['quantity'];
            if ($newQty > $product->available_quantity) {
                return $this->errorResponse(
                    "Cannot add more. Only {$product->available_quantity} {$product->weight_unit} available",
                    422
                );
            }
            $existing->update([
                'quantity'    => $newQty,
                'total_price' => $newQty * $product->price,
            ]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'seller_id'  => $product->seller_id,
                'quantity'   => $validated['quantity'],
                'unit_price' => $product->price,
                'total_price'=> $validated['quantity'] * $product->price,
            ]);
        }

        $this->recalculateCart($cart);
        $cart->load(['items.product.images', 'items.product.category']);

        return $this->successResponse($this->formatCart($cart), 'Item added to cart');
    }

    /**
     * Update quantity of a specific cart item.
     */
    public function updateItem(Request $request, string $itemId): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => 'required|numeric|min:0.001',
        ]);

        $cart = $this->getOrCreateCart($request->user()->id);
        $item = $cart->items()->where('id', $itemId)->firstOrFail();
        $product = $item->product;

        if ($validated['quantity'] > $product->available_quantity) {
            return $this->errorResponse(
                "Only {$product->available_quantity} {$product->weight_unit} available",
                422
            );
        }

        $item->update([
            'quantity'    => $validated['quantity'],
            'total_price' => $validated['quantity'] * $item->unit_price,
        ]);

        $this->recalculateCart($cart);
        $cart->load(['items.product.images', 'items.product.category']);

        return $this->successResponse($this->formatCart($cart), 'Cart item updated');
    }

    /**
     * Remove a specific cart item.
     */
    public function removeItem(Request $request, string $itemId): JsonResponse
    {
        $cart = $this->getOrCreateCart($request->user()->id);
        $item = $cart->items()->where('id', $itemId)->firstOrFail();
        $item->delete();

        $this->recalculateCart($cart);
        $cart->load(['items.product.images', 'items.product.category']);

        return $this->successResponse($this->formatCart($cart), 'Item removed from cart');
    }

    /**
     * Clear all items from the cart.
     */
    public function clear(Request $request): JsonResponse
    {
        $cart = $this->getOrCreateCart($request->user()->id);
        $cart->items()->delete();
        $cart->update(['subtotal' => 0, 'total_items' => 0]);

        return $this->successResponse(null, 'Cart cleared');
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private function getOrCreateCart(string $userId): Cart
    {
        return Cart::firstOrCreate(
            ['consumer_id' => $userId, 'status' => 'ACTIVE'],
            ['subtotal' => 0, 'total_items' => 0]
        );
    }

    private function recalculateCart(Cart $cart): void
    {
        $cart->refresh();
        $subtotal    = $cart->items->sum('total_price');
        $totalItems  = $cart->items->count();
        $cart->update(['subtotal' => $subtotal, 'total_items' => $totalItems]);
    }

    private function formatCart(Cart $cart): array
    {
        return [
            'id'          => $cart->id,
            'subtotal'    => (float) $cart->subtotal,
            'total_items' => $cart->total_items,
            'items'       => $cart->items->map(fn($item) => [
                'id'          => $item->id,
                'product_id'  => $item->product_id,
                'quantity'    => (float) $item->quantity,
                'unit_price'  => (float) $item->unit_price,
                'total_price' => (float) $item->total_price,
                'product'     => [
                    'id'           => $item->product->id,
                    'name'         => $item->product->name,
                    'slug'         => $item->product->slug,
                    'price'        => (float) $item->product->price,
                    'weight_unit'  => $item->product->weight_unit,
                    'stock_status' => $item->product->stock_status,
                    'image'        => $item->product->primary_image,
                    'category'     => $item->product->category ? [
                        'id'   => $item->product->category->id,
                        'name' => $item->product->category->name,
                        'slug' => $item->product->category->slug,
                    ] : null,
                ],
            ])->values(),
        ];
    }
}
