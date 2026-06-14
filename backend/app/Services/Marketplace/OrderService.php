<?php

declare(strict_types=1);

namespace App\Services\Marketplace;

use App\Models\Order;
use App\Enums\OrderStatus;

class OrderService
{
    public function __construct(
        protected InventoryService $inventoryService
    ) {}

    public function placeOrder(Order $order): Order
    {
        $order->status = OrderStatus::PendingSellerApproval->value;
        $order->save();

        // Trigger Event
        // event(new \App\Events\OrderPlaced($order));

        // Reserve inventory
        foreach ($order->items as $item) {
            $this->inventoryService->reserveInventory($item->product_id, $item->quantity);
        }

        return $order;
    }

    public function approveOrder(Order $order): Order
    {
        $order->status = OrderStatus::Approved->value;
        $order->save();

        // Deduct inventory permanently
        foreach ($order->items as $item) {
            $this->inventoryService->commitReservation($item->product_id, $item->quantity);
        }

        // event(new \App\Events\OrderApproved($order));

        return $order;
    }

    public function rejectOrder(Order $order, string $reason): Order
    {
        $order->status = OrderStatus::Rejected->value;
        $order->rejection_reason = $reason;
        $order->save();

        // Release inventory
        foreach ($order->items as $item) {
            $this->inventoryService->releaseInventory($item->product_id, $item->quantity);
        }

        // event(new \App\Events\OrderRejected($order));

        return $order;
    }

    public function cancelOrder(Order $order, string $reason): Order
    {
        $order->status = OrderStatus::Cancelled->value;
        $order->cancel_reason = $reason;
        $order->cancelled_at = now();
        $order->save();

        // Release inventory
        foreach ($order->items as $item) {
            $this->inventoryService->releaseInventory($item->product_id, $item->quantity);
        }

        // event(new \App\Events\OrderCancelled($order));

        return $order;
    }

    public function updateStatus(Order $order, OrderStatus $status): Order
    {
        $order->status = $status->value;
        $order->save();

        // Trigger respective events based on status
        // e.g., if ($status === OrderStatus::Processing) event(new OrderProcessing($order));

        return $order;
    }
}
