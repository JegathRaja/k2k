# Launch Readiness & Operational Audit

## 1. Production Environment Certification
- **Infrastructure**: AWS Production VPC provisioned. Load balancers attached to Auto-Scaling Groups.
- **Domain & SSL**: KadalOperations domain configured with Cloudflare DNS. Strict SSL (TLS 1.3) enforced globally.
- **Communications**: SendGrid API configured for transactional emails. Twilio/MSG91 active for SMS OTPs and alerts.
- **Payments**: Razorpay/Stripe production keys injected into secret manager. Webhooks actively listening on `/api/webhooks/payments`.

## 2. Legal & Compliance Audit
- **Privacy Policy & T&C**: Verified and published via CMS. Compliant with local data protection regulations.
- **Seller Agreement**: Digital signing workflow active during the Seller Onboarding process.
- **Refund Policy**: Clearly visible on checkout pages to reduce chargeback liabilities.

## 3. Incident Command Structure
- **Level 1 (Support Agent)**: General customer complaints, basic refund requests.
- **Level 2 (Operations Manager)**: Seller disputes, inventory sync failures, delivery escalation.
- **Level 3 (Engineering Lead)**: Payment gateway failures, database latency, system outages.
- **Level 4 (Security/CTO)**: Suspected breaches, massive anomaly alerts.
