# Enterprise Workflow & Role Ecosystem

## 1. Advanced Role System
To support large-scale operations across multiple states, the RBAC (Role-Based Access Control) system expands to a hierarchical structure.
- **Regional Level**: Regional Admin, Regional Finance Manager.
- **District Level**: District Operations Manager, District Support Agent.
- **Facility Level**: Warehouse Manager, Procurement Officer, Delivery Supervisor.

Permissions are strictly scoped territorially. A District Manager in Chennai cannot view or authorize refunds for orders placed in Coimbatore.

## 2. Enterprise Workflow Engine
Instead of hardcoding business logic (e.g., `if status == 'PENDING' then change to 'APPROVED'`), KadalOperations utilizes a Finite State Machine (FSM) configuration for critical operations.
- **Workflows Supported**: 
  - Vendor Onboarding (KYC Verification -> Bank Validation -> Operations Approval).
  - High-Value Refund Workflow (CS Agent Draft -> Finance Manager Approval -> Gateway Execution).
  - Procurement Approval Workflow.

## 3. Customer Support & Knowledge Management
- **Customer Support Platform**: Built-in ticketing architecture. Associates tickets directly to Order IDs and Customer IDs. Implements SLA countdowns (e.g., 24-hour resolution targets).
- **Knowledge Management**: A centralized, localized document repository for Standard Operating Procedures (SOPs). Ensures consistent training across all fulfillment centers and support hubs.
