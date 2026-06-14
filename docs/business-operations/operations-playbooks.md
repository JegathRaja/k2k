# Revenue & Support Operations Playbook

## 1. Revenue Operations
The RevOps team monitors the financial heartbeat of the marketplace.
- **Daily Cadence**: 
  - Verify Gross Merchandise Value (GMV) against Payment Gateway settlement reports.
  - Track Average Order Value (AOV) and investigate sudden drops.
- **Profitability Tracking**: Monitor net margins by calculating `(Total Commission + Delivery Markup) - (Payment Gateway Fees + SMS/Email Costs + Hosting Costs)`.
- **Financial Operations**: Ensure Seller Payouts run seamlessly on the T+2 schedule. Any payout failures trigger immediate Level 2 escalation.

## 2. Support Operations & Playbooks
- **SLA Targets**: 
  - First Response Time (FRT): < 15 Minutes.
  - Resolution Time: < 24 Hours.
- **Standard Operating Procedures (SOPs)**:
  - *Order Failure*: Auto-refund to source. Send apology email with a 10% discount code.
  - *Inventory Dispute*: If a seller cancels post-acceptance due to "Out of Stock", penalize seller rating. Refund customer immediately.
  - *Delivery Issues*: Escalate directly to 3PL API dashboard. Notify customer via WhatsApp of the delay.
- **Support Team Structure**: Tiered support utilizing Freshdesk/Zendesk integration, deeply linked into the KadalOperations Admin dashboard to provide agents with instant Order context.
