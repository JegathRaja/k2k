<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Consumer;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Enums\OrderStatus;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Services\Inventory\InventoryService;
use App\Notifications\OrderCreatedNotification;

class OrderController extends Controller
{
    use ApiResponse;

    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * List all orders for the authenticated consumer.
     */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with([
            'items.product:id,name,slug,weight_unit',
            'address',
            'seller:id,first_name,last_name',
        ])
            ->where('consumer_id', $request->user()->id)
            ->latest()
            ->paginate($request->get('per_page', 10));

        return $this->successResponse($orders, 'Orders retrieved');
    }

    /**
     * Get a specific order.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $order = Order::with([
            'items.product:id,name,slug,weight_unit',
            'address',
            'seller:id,first_name,last_name',
        ])
            ->where('consumer_id', $request->user()->id)
            ->findOrFail($id);

        return $this->successResponse($order, 'Order retrieved');
    }

    /**
     * Checkout: convert the active cart into an order.
     */
    public function checkout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'address_id' => 'required|uuid|exists:addresses,id',
            'notes'      => 'nullable|string|max:500',
        ]);

        $user = $request->user();

        // Verify the address belongs to this user
        $address = Address::where('id', $validated['address_id'])
            ->where('user_id', $user->id)
            ->firstOrFail();

        // Get active cart
        $cart = Cart::where('consumer_id', $user->id)
            ->where('status', 'ACTIVE')
            ->with(['items.product'])
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return $this->errorResponse('Cart is empty. Add items before checking out.', 422);
        }

        // Validate stock for all items
        foreach ($cart->items as $item) {
            $product = $item->product;
            if (!$product || $product->available_quantity < $item->quantity) {
                return $this->errorResponse(
                    "Insufficient stock for: {$product?->name}. Available: {$product?->available_quantity} {$product?->weight_unit}",
                    422
                );
            }
        }

        // Group items by seller (create one order per seller)
        $itemsBySeller = $cart->items->groupBy('seller_id');
        $orders        = [];

        DB::transaction(function () use ($itemsBySeller, $user, $address, $validated, $cart, &$orders) {
            foreach ($itemsBySeller as $sellerId => $items) {
                $subtotal = $items->sum('total_price');
                $tax      = round($subtotal * 0.05, 2); // 5% tax placeholder
                $delivery = 50.00; // Flat delivery fee placeholder
                $total    = $subtotal + $tax + $delivery;

                $order = Order::create([
                    'order_number'   => $this->generateOrderNumber(),
                    'consumer_id'    => $user->id,
                    'seller_id'      => $sellerId,
                    'address_id'     => $address->id,
                    'status'         => OrderStatus::PendingSellerApproval->value,
                    'subtotal'       => $subtotal,
                    'tax_amount'     => $tax,
                    'delivery_fee'   => $delivery,
                    'discount_amount'=> 0,
                    'total'          => $total,
                    'notes'          => $validated['notes'] ?? null,
                ]);

                foreach ($items as $item) {
                    OrderItem::create([
                        'order_id'        => $order->id,
                        'product_id'      => $item->product_id,
                        'quantity'        => $item->quantity,
                        'unit_price'      => $item->unit_price,
                        'total_price'     => $item->total_price,
                        'product_snapshot'=> [
                            'name'        => $item->product->name,
                            'price'       => $item->product->price,
                            'weight_unit' => $item->product->weight_unit,
                            'category'    => $item->product->category?->name,
                        ],
                    ]);

                    // Use InventoryService to properly reserve stock
                    $this->inventoryService->reserveStock($item->product, $item->quantity);
                }

                $orders[] = $order->load(['items', 'address', 'seller:id,first_name,last_name']);

                // Notify seller
                if ($order->seller) {
                    $order->seller->notify(new OrderCreatedNotification($order));
                }
            }

            // Mark cart as converted
            $cart->update(['status' => 'CONVERTED_TO_ORDER']);
            $cart->items()->delete();
        });

        return $this->successResponse(
            count($orders) === 1 ? $orders[0] : $orders,
            'Order placed successfully',
            201
        );
    }

    /**
     * Cancel a pending order.
     */
    public function cancel(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $order = Order::where('consumer_id', $request->user()->id)->findOrFail($id);

        if (!$order->isCancellable()) {
            return $this->errorResponse('This order cannot be cancelled in its current status.', 422);
        }

        $order->update([
            'status'        => OrderStatus::Cancelled->value,
            'cancelled_at'  => now(),
            'cancel_reason' => $validated['reason'] ?? 'Cancelled by consumer',
        ]);

        // Restore stock via InventoryService
        foreach ($order->items as $item) {
            if ($item->product) {
                $this->inventoryService->releaseStock($item->product, $item->quantity);
            }
        }

        return $this->successResponse($order->fresh(), 'Order cancelled');
    }

    private function generateOrderNumber(): string
    {
        return 'ORD-' . strtoupper(Str::random(4)) . '-' . date('Ymd');
    }
}
