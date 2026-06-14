<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Enums\OrderStatus;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\Inventory\InventoryService;

class OrderController extends Controller
{
    use ApiResponse;

    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * List all orders assigned to this seller.
     */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with([
            'items.product:id,name,slug,weight_unit',
            'consumer:id,first_name,last_name,contact_number',
            'address',
        ])
            ->where('seller_id', $request->user()->id)
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->get('per_page', 20));

        return $this->successResponse($orders, 'Orders retrieved');
    }

    /**
     * Get a single seller order.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $order = Order::with([
            'items.product:id,name,slug,weight_unit,price',
            'consumer:id,first_name,last_name,contact_number,email',
            'address',
        ])
            ->where('seller_id', $request->user()->id)
            ->findOrFail($id);

        return $this->successResponse($order, 'Order retrieved');
    }

    /**
     * Approve a pending order.
     */
    public function approve(Request $request, string $id): JsonResponse
    {
        $order = Order::where('seller_id', $request->user()->id)->findOrFail($id);

        if ($order->status !== OrderStatus::PendingSellerApproval) {
            return $this->errorResponse('Order is not pending approval.', 422);
        }

        $order->update(['status' => OrderStatus::Approved->value]);

        return $this->successResponse($order->fresh(), 'Order approved');
    }

    /**
     * Reject a pending order.
     */
    public function reject(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $order = Order::where('seller_id', $request->user()->id)->findOrFail($id);

        if ($order->status !== OrderStatus::PendingSellerApproval) {
            return $this->errorResponse('Order is not pending approval.', 422);
        }

        $order->update([
            'status'           => OrderStatus::Rejected->value,
            'rejection_reason' => $validated['reason'],
        ]);

        // Restore stock
        foreach ($order->items as $item) {
            if ($item->product) {
                $this->inventoryService->releaseStock($item->product, $item->quantity);
            }
        }

        return $this->successResponse($order->fresh(), 'Order rejected');
    }

    /**
     * Update order status (processing, ready, out for delivery, delivered).
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:processing,ready_for_delivery,out_for_delivery,delivered',
        ]);

        $order = Order::where('seller_id', $request->user()->id)->findOrFail($id);

        if ($order->status->isTerminal()) {
            return $this->errorResponse('Cannot update a completed/cancelled order.', 422);
        }

        $order->update(['status' => $validated['status']]);

        // Fulfill stock if delivered
        if ($validated['status'] === 'delivered') {
            foreach ($order->items as $item) {
                if ($item->product) {
                    $this->inventoryService->fulfillStock($item->product, $item->quantity);
                }
            }
        }

        return $this->successResponse($order->fresh(), 'Order status updated');
    }
}
