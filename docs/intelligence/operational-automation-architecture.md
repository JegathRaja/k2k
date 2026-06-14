# Operational Automation Architecture

## 1. Automation Framework
The Operational Automation Engine translates BI insights and predictive forecasts into actionable workflows. Crucially, the system maintains a "human-in-the-loop" constraint for all destructive or financially impactful actions.

## 2. Automated Alerts & Reminders
- **Low-Stock Alerts**: Triggered via email/SMS when Available Stock drops below the product's calculated 7-day run rate.
- **Seller Reminders**: Auto-generated SMS to sellers who have `ACCEPTED` orders but haven't marked them `PREPARING` within SLA boundaries.
- **Order Escalation**: If an order remains stuck in `PACKED` state awaiting logistics for > 24 hours, the system automatically escalates a ticket to Admin Support.
- **Inventory Warnings**: Automated push notifications warning sellers of perishable stock nearing end-of-life (based on creation date).

## 3. AI-Powered Reporting
- **Report Generation Pipeline**: Batch jobs execute complex analytical SQL queries. The raw JSON outputs are passed through a secure LLM summarization pipeline.
- **Output Formats**:
  - *Weekly Executive Summary*: Sent via email, highlighting GMV growth, top sellers, and critical anomalies.
  - *Seller Performance Summary*: Available in the Seller Dashboard, offering a conversational summary of their week (e.g., "Your sales grew 5%, largely driven by your Prawns listing.").
