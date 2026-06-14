# Autonomous QA Agent Architecture

## 1. Overview
The Autonomous QA Agent runs continuously against staging and production (read-only where applicable) to verify system integrity. It mimics consumer and seller behaviors without human intervention.

## 2. Agent Responsibilities
1. **Detect Failures**: Continuous synthetic monitoring of critical paths.
2. **Capture Evidence**: Record HAR files, network traces, and DOM snapshots on failure.
3. **Generate Reports**: Publish Pass/Fail metrics to the QA Health Dashboard.
4. **Recommend Fixes**: Analyze logs/traces and use integrated LLM pipelines to suggest root causes.
5. **Retest**: Automatically retry the failed scenario upon deployment of a fix.

## 3. Verification Scopes
- **Authentication**: Sign-up, Sign-in, Token refresh, OTP delivery.
- **Product Operations**: Seller creation of products, validation rules, image uploads.
- **Inventory Updates**: Ensuring stock reservations lock correctly during checkout races.
- **Order Lifecycle**: E2E simulation from `PLACED` to `DELIVERED`.
- **Realtime Synchronization**: Verifying WebSocket events are emitted and received.
- **Notifications**: Validating email/SMS dispatch queues.

## 4. Execution Strategy
- Runs hourly against Staging.
- Runs daily (Synthetic Health checks) against Production using dedicated "Test Agent" accounts.
