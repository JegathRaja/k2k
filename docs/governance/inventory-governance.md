# Inventory Governance Constitution

This document defines the strict policies for inventory management, preventing race conditions and overselling.

## 1. Core Principles & Formulas
- `Available Stock = Total Stock - Reserved Stock`
- Consumers only see `Available Stock`.

## 2. Stock Rules

### Stock Reservation Rules
- Triggered when an Order is `PLACED`.
- Moves the requested amount from `Available` to `Reserved`.
- A reservation is temporary. It must expire if payment fails or the seller rejects within SLA.

### Stock Deduction Rules (Commit)
- Triggered when an Order is `ACCEPTED` by the Seller.
- Permanently deducts from `Total Stock` and `Reserved Stock`.

### Stock Release Rules
- Triggered if an Order is `CANCELLED`, `REJECTED`, or `FAILED`.
- Moves `Reserved Stock` back to `Available`.

### Stock Adjustment Rules
- Triggered by the Seller (e.g., adding fresh catch).
- Must log an `Inventory Event` (e.g., `MANUAL_ADD`, `DAMAGE_WRITE_OFF`).

### Stock Transfer Rules
- (N/A for Kadal2Kadaai MVP unless multi-warehouse is introduced).

## 3. Overselling Prevention Rules
- The database update for reservation must use optimistic locking or atomic updates (e.g., `UPDATE stock SET reserved = reserved + X WHERE available >= X`).
- Under no circumstances can `Available Stock` drop below zero.

## 4. Auditing & Reconciliation
- **Inventory Audit Rules**: All changes to stock levels must be logged in an `inventory_ledgers` table.
- **Inventory Reconciliation Rules**: Nightly cron jobs should sum all active reservations and ensure they exactly match the `Reserved Stock` value in the database.
- **Inventory Event Rules**: Any discrepancy raises an alert to Admins.
