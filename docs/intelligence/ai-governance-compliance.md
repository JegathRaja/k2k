# AI Governance & Compliance

## 1. Core Mandates
All artificial intelligence, machine learning, and automated heuristic systems deployed within KadalOperations must strictly adhere to the following governance rules.

### Transparency & Explainability
- Users must always know when they are interacting with an AI (e.g., clearly labeling the "Seller AI Assistant").
- Recommendations (like restocking or price adjustments) must provide a visible rationale (e.g., "Recommended because local demand increased by 20% this week").

### Auditability
- Every AI-generated report, recommendation, and operational summary is logged.
- The prompts, model versions, and raw data inputs used for any generation must be traceable for debugging and compliance.

### Human Oversight
- **No Autonomous Financial Decisions**: The AI cannot issue refunds, authorize payouts, or change commission rates.
- **No Autonomous Seller Penalties**: The AI can flag suspicious behavior to the SOC, but it cannot autonomously suspend a seller account.
- **No Autonomous Pricing Changes**: The system provides pricing intelligence and suggestions, but the Seller must explicitly click to accept and update prices. Dynamic algorithmic pricing is strictly forbidden to maintain trust.

## 2. Data Privacy Integration
- Internal AI pipelines utilizing LLMs must not transmit Personally Identifiable Information (PII) to public LLM APIs without strict anonymization or enterprise data agreements preventing model training on payload data.
