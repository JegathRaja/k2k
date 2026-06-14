# Business Intelligence & Analytics Architecture

## 1. Overview
The BI layer aggregates transactional data into operational metrics without impacting the performance of the core OLTP database. Read-replicas or a dedicated Data Warehouse (e.g., ClickHouse / BigQuery) power the reporting engine.

## 2. Enterprise Reporting Engine
Reports can be generated automatically and dispatched:
- **Daily Reports**: End of Day (EOD) sales, new seller registrations.
- **Weekly Reports**: Category performance, cohort retention.
- **Monthly Reports**: Executive summaries, gross merchandise value (GMV), platform commission totals.

## 3. Domain Analytics
### Enterprise Analytics (Admin)
- **Financial**: Daily/Weekly/Monthly Revenue, Average Order Value (AOV), Refund Ratios.
- **Platform**: Top Sellers, User Growth, Top Categories by Volume.
- **Health**: Order Status Distribution (identifying bottlenecks in `PREPARING` vs `DISPATCHED`).

### Seller Analytics
- **Sales**: Revenue trends, Best Sellers.
- **Inventory**: Inventory Turnover rate, low-stock alerts.
- **Fulfillment**: Average time to pack, return rates per product.

### Customer Analytics
- **Engagement**: Repeat Order Rate, Wishlist conversions, Cart Abandonment rates.
- **Value**: Customer Lifetime Value (CLV) baseline computations.
