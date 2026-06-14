# AI Architecture Overview

## 1. Internal AI Assistants
KadalOperations integrates LLM-based assistants embedded within the Admin and Seller dashboards to provide natural-language insights over structured operational data.

### 1.1. Admin AI Assistant
- **Capabilities**: Conversational access to platform health, revenue drops, inventory issues, and seller performance.
- **Architecture**: A Retrieval-Augmented Generation (RAG) pipeline connected to the Data Warehouse. User queries (e.g., "Which category grew fastest this month?") are translated into optimized SQL/GraphQL queries via a Semantic Layer, ensuring the LLM does not hallucinate data.

### 1.2. Seller AI Assistant
- **Capabilities**: Personalized shop analytics, detecting fast-moving items, and forecasting stock depletion.
- **Architecture**: Tenant-isolated query execution. The LLM is restricted via Row-Level Security (RLS) to ensure it can only query and summarize data belonging to the specific `seller_id`.

## 2. Anomaly Detection Engine
- **Pattern Recognition**: Continuous background analysis of time-series data.
- **Metrics Tracked**: Sudden Revenue Drops, Order Spikes, Seller Inactivity, Suspicious Cancellation Rates.
- **Trigger**: Generates alerts into the Security Operations Center (SOC) or Operations Escalation queue when an anomaly deviates beyond 3 standard deviations from the 30-day moving average.

## 3. Pricing Intelligence Framework
- **Analysis Engine**: Tracks category pricing medians, historical pricing trends, and competitor averages (if data is available).
- **Execution**: The system does NOT automatically alter prices. It surfaces a "Recommended Action" card on the Seller Dashboard (e.g., "Prawns are currently selling 15% higher in your region. Consider adjusting your price to maximize margins.").
