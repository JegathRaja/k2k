# Kadal2Kadaai — Marketplace Workflow Architecture

This document describes the foundational marketplace flow and lifecycle systems implemented in the Kadal2Kadaai architecture.

## 1. Consumer Journey

1. **Browse & Search**: Consumers browse products grouped by categories and search for specific catches on the Marketplace Homepage.
2. **Product Details**: Consumers view product information, seller details (Shop Name, Rating), and available quantities.
3. **Cart Addition**: Items are added to the Cart (`carts` and `cart_items` tables).
4. **Checkout**: Consumer initiates checkout, selects their `preferred_delivery_address` (from `consumer_profiles`), and places the order.

## 2. Order & Inventory Lifecycle

When a consumer places an order, the following workflow is triggered via the `OrderService` and `InventoryService`:

### A. Order Placement
- The order is created with status `PendingSellerApproval`.
- `InventoryService->reserveInventory()` is called:
  - Validates `available_quantity` > `requested_quantity`.
  - Moves `quantity` into `reserved_quantity`.
- Event triggered: `OrderPlaced`. Notification sent to Seller.

### B. Seller Approval / Rejection
The Seller reviews the pending order.

**If Approved:**
- Status changes to `Approved`.
- `InventoryService->commitReservation()` is called:
  - Deducts stock permanently from both `quantity` and `reserved_quantity`.
- Event triggered: `OrderApproved`. Notification sent to Consumer.

**If Rejected:**
- Status changes to `Rejected`.
- Seller must provide a `rejection_reason` (e.g., "Out of Stock", "Price Changed").
- `InventoryService->releaseInventory()` is called:
  - Moves `reserved_quantity` back to `available_quantity`.
- Event triggered: `OrderRejected`. Notification sent to Consumer.

### C. Fulfillment & Delivery
- Seller updates status to `Processing`. (Event: `OrderProcessing`)
- Seller prepares order and marks as `ReadyForDelivery`. (Event: `OrderReadyForDelivery`)
- Order is assigned to Delivery Partner, marked as `OutForDelivery`. (Event: `OrderOutForDelivery`)
- Order successfully handed to Consumer, marked as `Delivered`. (Event: `OrderDelivered`)

## 3. Marketplace Entities

### Consumer Profiles (`consumer_profiles`)
Separates purchasing context from auth data. Stores loyalty points, preferred addresses, and total lifetime spending.

### Seller Profiles (`seller_profiles`)
Stores vendor business logic: Shop Name, GST, Bank Account details, and current Seller Status (`PENDING`, `ACTIVE`, `SUSPENDED`).

### Future: Fisherman Role
An architectural placeholder (`Fisherman` role in `UserRole` enum) is created to support direct fisherman-to-marketplace integrations (Catch uploads, direct auctions) in the future.

## 4. Seller Dashboard Analytics

The `DashboardService` powers the Seller portal with KPIs:
- Total Orders, Consumers, Revenue (Daily/Weekly/Lifetime)
- Orders categorized by status (Pending, Processing, Delivered)

The `CustomerManagementService` provides CRM functionality for sellers, displaying total spending, average order value, and order history per customer.
