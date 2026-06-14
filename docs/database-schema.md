# Kadal2Kadaai — Database Schema

## Conventions

- **Primary Keys**: UUID v4 (`char(36)`) — not auto-increment integers
- **Timestamps**: All tables have `created_at`, `updated_at`
- **Soft Deletes**: Business entities have `deleted_at` (users, products, orders, etc.)
- **Naming**: `snake_case` for columns and tables, plural table names
- **Foreign Keys**: `{table_singular}_id` pattern (e.g., `user_id`, `product_id`)
- **Status Columns**: Use ENUM types via PHP backed enums
- **JSON Columns**: Used for flexible/denormalized data (order snapshots, settings values)
- **Indexes**: Created on all FK columns, status columns, and frequently-queried columns

---

## Table Reference

### 1. `users`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `name` | varchar(255) | |
| `email` | varchar(255) | nullable, unique |
| `phone` | varchar(15) | nullable, unique |
| `google_id` | varchar(255) | nullable, unique |
| `avatar` | text | nullable, R2 URL |
| `password` | varchar(255) | nullable (social/OTP users) |
| `status` | enum | active, inactive, suspended, pending |
| `email_verified_at` | timestamp | nullable |
| `phone_verified_at` | timestamp | nullable |
| `remember_token` | varchar(100) | nullable |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |
| `deleted_at` | timestamp | nullable (soft delete) |

**Indexes**: `email`, `phone`, `google_id`, `status`

---

### 2. `roles` & `permissions` (Spatie Laravel Permission)

Standard tables: `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, `role_has_permissions`

**Roles**: `super_admin`, `admin`, `consumer`, `seller`, `fisherman`, `delivery_partner`

---

### 3. `addresses`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → users | |
| `label` | varchar(50) | Home, Work, Other |
| `street` | text | |
| `city` | varchar(100) | |
| `state` | varchar(100) | |
| `pincode` | varchar(10) | |
| `landmark` | varchar(255) | nullable |
| `latitude` | decimal(10,8) | nullable |
| `longitude` | decimal(11,8) | nullable |
| `is_default` | boolean | default false |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |
| `deleted_at` | timestamp | nullable |

**Indexes**: `user_id`, `pincode`, `(latitude, longitude)`

---

### 4. `otps`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `phone` | varchar(15) | |
| `otp_hash` | varchar(255) | bcrypt hash |
| `purpose` | enum | login, register, reset, verify |
| `attempts` | tinyint | default 0, max 5 |
| `expires_at` | timestamp | |
| `verified_at` | timestamp | nullable |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Indexes**: `phone`, `expires_at`

---

### 5. `categories`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `parent_id` | uuid FK → categories | nullable (self-referential) |
| `name` | varchar(255) | |
| `slug` | varchar(255) | unique |
| `description` | text | nullable |
| `icon` | varchar(100) | nullable (emoji or icon name) |
| `image` | text | nullable (R2 URL) |
| `sort_order` | integer | default 0 |
| `is_active` | boolean | default true |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |
| `deleted_at` | timestamp | nullable |

**Indexes**: `slug`, `parent_id`, `is_active`, `sort_order`

---

### 6. `products`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `seller_id` | uuid FK → users | |
| `category_id` | uuid FK → categories | |
| `name` | varchar(255) | |
| `slug` | varchar(255) | unique |
| `description` | text | nullable |
| `price` | decimal(10,2) | base price |
| `sale_price` | decimal(10,2) | nullable (discounted) |
| `unit` | varchar(50) | kg, piece, dozen, etc. |
| `minimum_order` | decimal(8,2) | default 0.25 |
| `status` | enum | draft, active, inactive, out_of_stock |
| `is_featured` | boolean | default false |
| `meta_title` | varchar(255) | nullable |
| `meta_description` | text | nullable |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |
| `deleted_at` | timestamp | nullable |

**Indexes**: `seller_id`, `category_id`, `slug`, `status`, `is_featured`

---

### 7. `product_images`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `product_id` | uuid FK → products | |
| `url` | text | R2 URL |
| `alt_text` | varchar(255) | nullable |
| `sort_order` | integer | default 0 |
| `is_primary` | boolean | default false |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Indexes**: `product_id`, `is_primary`

---

### 8. `inventory`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `product_id` | uuid FK → products | unique |
| `quantity` | decimal(10,3) | available quantity |
| `reserved_quantity` | decimal(10,3) | held for pending orders |
| `low_stock_threshold` | decimal(10,3) | alert threshold |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Indexes**: `product_id`, `quantity`

---

### 9. `orders`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `order_number` | varchar(20) | unique, human-readable |
| `consumer_id` | uuid FK → users | |
| `seller_id` | uuid FK → users | |
| `address_id` | uuid FK → addresses | |
| `status` | enum | pending, confirmed, preparing, ready, picked_up, delivered, cancelled, refunded |
| `subtotal` | decimal(10,2) | |
| `tax_amount` | decimal(10,2) | default 0 |
| `delivery_fee` | decimal(10,2) | default 0 |
| `discount_amount` | decimal(10,2) | default 0 |
| `total` | decimal(10,2) | |
| `notes` | text | nullable |
| `cancelled_at` | timestamp | nullable |
| `cancel_reason` | text | nullable |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |
| `deleted_at` | timestamp | nullable |

**Indexes**: `order_number`, `consumer_id`, `seller_id`, `status`, `created_at`

---

### 10. `order_items`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `order_id` | uuid FK → orders | |
| `product_id` | uuid FK → products | |
| `quantity` | decimal(8,3) | |
| `unit_price` | decimal(10,2) | price at time of order |
| `total_price` | decimal(10,2) | |
| `product_snapshot` | json | full product data at order time |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Indexes**: `order_id`, `product_id`

---

### 11. `payments`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `order_id` | uuid FK → orders | |
| `razorpay_order_id` | varchar(100) | nullable |
| `razorpay_payment_id` | varchar(100) | nullable, unique |
| `razorpay_signature` | varchar(255) | nullable |
| `method` | enum | razorpay, wallet, cod |
| `status` | enum | pending, processing, completed, failed, refunded |
| `amount` | decimal(10,2) | |
| `currency` | char(3) | default INR |
| `gateway_response` | json | nullable |
| `paid_at` | timestamp | nullable |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Indexes**: `order_id`, `razorpay_payment_id`, `status`

---

### 12. `wallets`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → users | unique |
| `balance` | decimal(12,2) | default 0.00 |
| `reserved_balance` | decimal(12,2) | default 0.00 |
| `currency` | char(3) | default INR |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Indexes**: `user_id`

---

### 13. `wallet_transactions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `wallet_id` | uuid FK → wallets | |
| `type` | enum | credit, debit, reserve, release |
| `amount` | decimal(12,2) | |
| `balance_after` | decimal(12,2) | running balance |
| `reference_type` | varchar(100) | nullable (App\Models\Order) |
| `reference_id` | uuid | nullable |
| `description` | varchar(255) | |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Indexes**: `wallet_id`, `type`, `(reference_type, reference_id)`, `created_at`

---

### 14. `commissions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `order_id` | uuid FK → orders | |
| `seller_id` | uuid FK → users | |
| `gross_amount` | decimal(10,2) | order total |
| `commission_rate` | decimal(5,2) | percentage |
| `commission_amount` | decimal(10,2) | |
| `net_amount` | decimal(10,2) | seller earnings |
| `status` | enum | pending, settled, disputed |
| `settled_at` | timestamp | nullable |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Indexes**: `order_id`, `seller_id`, `status`

---

### 15. `deliveries`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `order_id` | uuid FK → orders | |
| `partner_id` | uuid FK → users | nullable |
| `status` | enum | unassigned, assigned, picked_up, in_transit, delivered, failed |
| `pickup_address` | text | |
| `delivery_address` | text | |
| `distance_km` | decimal(8,2) | nullable |
| `estimated_minutes` | integer | nullable |
| `assigned_at` | timestamp | nullable |
| `picked_up_at` | timestamp | nullable |
| `delivered_at` | timestamp | nullable |
| `delivery_proof` | text | nullable (R2 URL) |
| `tracking_url` | varchar(500) | nullable |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Indexes**: `order_id`, `partner_id`, `status`

---

### 16. `notifications`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → users | |
| `type` | varchar(100) | notification class name |
| `channel` | enum | in_app, email, sms, whatsapp |
| `title` | varchar(255) | |
| `body` | text | |
| `data` | json | nullable |
| `action_url` | varchar(500) | nullable |
| `read_at` | timestamp | nullable |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Indexes**: `user_id`, `read_at`, `channel`, `created_at`

---

### 17. `audit_logs`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → users | nullable (system actions) |
| `action` | varchar(100) | e.g., `user.login`, `order.status_changed` |
| `model_type` | varchar(100) | nullable |
| `model_id` | uuid | nullable |
| `old_values` | json | nullable |
| `new_values` | json | nullable |
| `ip_address` | varchar(45) | |
| `user_agent` | text | nullable |
| `created_at` | timestamp | |

**Indexes**: `user_id`, `action`, `(model_type, model_id)`, `created_at`
> No `updated_at` — audit logs are immutable

---

### 18. `settings`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `key` | varchar(100) | unique |
| `value` | json | flexible value storage |
| `group` | varchar(50) | general, payment, delivery, notification, commission |
| `description` | text | nullable |
| `is_public` | boolean | default false (API-accessible) |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Indexes**: `key`, `group`, `is_public`

---

## Entity Relationship Summary

```
users ──── addresses (1:N)
users ──── wallets (1:1)
users ──── notifications (1:N)
users ──── audit_logs (1:N)
users(seller) ──── products (1:N)
users(consumer) ──── orders (1:N)
users(seller) ──── orders (1:N)
users(partner) ──── deliveries (1:N)

categories ──── categories (self-referential 1:N)
categories ──── products (1:N)

products ──── product_images (1:N)
products ──── inventory (1:1)
products ──── order_items (1:N)

orders ──── order_items (1:N)
orders ──── payments (1:1)
orders ──── deliveries (1:1)
orders ──── commissions (1:1)

wallets ──── wallet_transactions (1:N)
```
