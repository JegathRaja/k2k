# Scalability Assessment & Readiness

## 1. Readiness Benchmarks
The platform has been architecturally validated for the following theoretical thresholds before requiring sharding or radical redesign:

### 10 to 1,000 Sellers
- Standard architecture (Single Primary DB, Multiple Read Replicas) operates smoothly.
- Caching layers (Redis) easily handle catalog and session load.

### 10,000 Sellers & 100,000 Products
- **Bottlenecks Identified**: Geospatial search for products and full-text search.
- **Solution**: Search operations must be offloaded from PostgreSQL/MySQL to a dedicated search engine (Elasticsearch / Meilisearch).
- **Bottlenecks Identified**: Realtime WebSocket connections for order tracking.
- **Solution**: Horizontal scaling of the Node.js/Soketi servers using a Redis Pub/Sub backplane.

### High Traffic Events (e.g., Festival Sales)
- **Bottlenecks Identified**: Inventory Reservation race conditions.
- **Solution**: Move stock reservation from relational DB locks to Redis atomic decrements (`DECRBY`) during checkout, syncing to DB asynchronously.

## 2. Horizontal Scaling Strategy
- All API and Frontend servers are stateless. They can be scaled horizontally via Auto-Scaling Groups (ASGs) based on CPU/Memory thresholds.
- Database scaling relies on vertically scaling the primary writer and horizontally scaling the read replicas.
