# Testing Governance Constitution

This document defines the strict quality assurance requirements and testing policies.

## 1. Unit Testing Standards
- Used for pure business logic, utilities, and services.
- **Requirement**: Complex pricing calculations, inventory reservations, and tax logic must have 100% path coverage via Unit Tests.

## 2. Integration & API Testing Standards
- All API endpoints must have integration tests asserting:
  - 200 OK for valid requests.
  - 422 Unprocessable Entity for invalid requests.
  - 401/403 for unauthorized access.
- Tests must interact with an isolated testing database (SQLite or a fresh Postgres DB per test run).

## 3. Realtime Testing Standards
- Event dispatching must be tested by asserting that the correct events are pushed to the Event Bus (e.g., `Event::assertDispatched`).

## 4. E2E Testing Standards
- Used for critical consumer flows (Login -> Browse -> Cart -> Checkout -> Success).
- Framed via Playwright or Cypress.
- Must run against a staging environment, not production.

## 5. Coverage Requirements & Definition of Test Complete
- Minimum code coverage required: **80% overall**, **100% for domain logic**.
- Pull requests failing the coverage check must be blocked automatically.

## 6. CI Requirements & Regression Rules
- All tests must pass in Continuous Integration (CI) on every commit to a feature branch.
- **Regression Rules**: If a bug makes it to production, a test MUST be written to replicate the bug before the fix is applied, ensuring it never happens again.
