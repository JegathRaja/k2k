# Business Intelligence Architecture

## 1. Centralized BI Layer
The BI layer aggregates transactional data from the primary PostgreSQL OLTP database into analytical cubes within the Data Warehouse.

### Key Metrics Tracked
- **Financial**: Revenue, Gross Merchandise Value (GMV), Average Order Value (AOV), Refund/Cancellation Rates.
- **Operational**: Orders per day, active products, inventory turnover.
- **Ecosystem**: Active Sellers, Customer Retention/Churn rate.

## 2. Smart Seller Insights
- **Heuristic Engine**: Generates actionable recommendations based on defined thresholds:
  - *Reduce Stock*: If a product hasn't sold in 14 days and stock > 50.
  - *Promote Product*: If a product has high conversion but low page views.
  - *Improve Fulfillment*: If average pack time exceeds 24 hours.

## 3. Customer Intelligence
- **Segmentation**: Customers are clustered using RFM (Recency, Frequency, Monetary) analysis.
  - *Champions*: Frequent buyers, high spend.
  - *At Risk*: Used to buy frequently, hasn't purchased in 30 days.
- **Tracking**: Purchase patterns, repeat buying frequency, and category affinity are tracked to fuel the Recommendation Engine.

## 4. Geographic & Marketing Intelligence
- **Geo-Analysis**: Demand mapping by District and City. Allows Admins to visualize Seller Density vs Customer Concentration to target new vendor acquisitions in underserved areas.
- **Marketing Analytics**: Tracking coupon attribution, banner CTR (Click-Through Rate), and overall campaign conversion funnels.
