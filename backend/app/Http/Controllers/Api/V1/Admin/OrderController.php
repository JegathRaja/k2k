<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Enums\OrderStatus;
use App\Services\Inventory\InventoryService;

class OrderController extends Controller
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index(Request $request)
    {
        $orders = Order::with([
            'items.product:id,name,slug',
            'consumer:id,first_name,last_name,contact_number',
            'seller:id,first_name,last_name',
            'address',
        ])
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->get('per_page', 20));

        return response()->json(['success' => true, 'message' => 'Orders retrieved', 'data' => $orders]);
    }

    public function show(string $id)
    {
        $order = Order::with([
            'items.product',
            'consumer:id,first_name,last_name,contact_number,email',
            'seller:id,first_name,last_name',
            'address',
        ])->findOrFail($id);
        
        return response()->json(['success' => true, 'message' => 'Order retrieved', 'data' => $order]);
    }

    public function updateStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:' . implode(',', OrderStatus::values()),
        ]);

        $order = Order::with('items.product')->findOrFail($id);
        $oldStatus = $order->status;
        $newStatus = OrderStatus::from($validated['status']);

        $order->update(['status' => $newStatus->value]);

        // If transitioning from non-terminal to rejected/cancelled, restore inventory
        if (!$oldStatus->isTerminal() && $newStatus->isTerminal() && $newStatus !== OrderStatus::Delivered) {
            foreach ($order->items as $item) {
                if ($item->product) {
                    $this->inventoryService->releaseStock($item->product, $item->quantity);
                }
            }
        }

        // If transitioning to delivered, fulfill stock
        if ($newStatus === OrderStatus::Delivered && $oldStatus !== OrderStatus::Delivered) {
            foreach ($order->items as $item) {
                if ($item->product) {
                    $this->inventoryService->fulfillStock($item->product, $item->quantity);
                }
            }
        }

        return response()->json(['success' => true, 'message' => 'Order status updated', 'data' => $order->fresh()]);
    }
}

