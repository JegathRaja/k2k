# Predictive Forecasting Architecture

## 1. Inventory Forecasting Foundation
- **Risk Detection**: Algorithms identify Stock-out risks by calculating the run-rate (Sales Velocity) against current Available Stock. 
- **Overstock Detection**: Flags items with high inventory and low sales velocity, allowing sellers to discount before spoilage.
- **Recommendations**: Proactively suggests Restocking Quantities based on 30-day historical averages and upcoming seasonal trends.

## 2. Demand Forecasting Models
- **Time-Series Analysis**: Forecasting future product and category demand using models like ARIMA or Prophet.
- **Variables Tracked**:
  - *Seasonal Demand*: Adjusting baselines for monsoon restrictions or peak fishing seasons.
  - *Festival Demand*: Predicting spikes during regional holidays based on historical YoY data.
  - *Regional Demand*: Localized demand curves.

## 3. Supply Chain Intelligence (Future Readiness)
- **Procurement Planning**: Architecture supports tracking fish sourcing trends to predict macro supply availability.
- **Vendor Performance**: Tracking supplier reliability, delivery times, and defect rates to optimize the wholesale supply chain.
