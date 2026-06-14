# Security Governance Constitution

This document defines the strict security policies and Access Control standards for Kadal2Kadaai.

## 1. RBAC & Permission Matrix
- **Roles**: `SuperAdmin`, `Admin`, `Support`, `Seller`, `Consumer`.
- **Permission Matrix**: All endpoints must explicitly verify permissions. Role checks are not enough; fine-grained permissions must be checked (e.g., `can('delete_product')`).
- Sellers can ONLY access entities belonging to their `seller_id` (Tenant isolation).

## 2. JWT & Session Rules
- APIs use Stateless JWT or Sanctum Tokens.
- Tokens must expire (e.g., 7 days for mobile, 2 hours for admin web).
- **Session Rules**: Web portal sessions must use `HttpOnly`, `Secure`, and `SameSite=Strict` cookies.

## 3. Password Rules
- Minimum 12 characters.
- Must use Argon2id or strong Bcrypt hashing.
- Forced reset if leaked in known breaches (HaveIBeenPwned API check).

## 4. API Protection Standards
- **Input Validation**: Zero Trust. All inputs must be strictly validated using Zod (Frontend) and FormRequests (Backend). No raw `$_POST` or `request()->all()`.
- **Rate Limiting**: Enforced per IP and per User ID. Specific limits for OTPs, Logins, and standard API calls.

## 5. Payment Security Rules
- **PCI-DSS Compliance**: The system MUST NEVER store credit card numbers or CVVs.
- **Webhook Verification Rules**: All incoming webhooks from Payment Gateways must cryptographically verify their signatures before taking action.

## 6. Audit Logging Rules
- All destructive actions (Delete, Suspend) and critical state changes (Payment Success, Order Refunded) must be logged permanently in an immutable `audit_logs` table.

## 7. Incident Response Rules
- In case of a suspected breach, all active sessions and API tokens can be instantly revoked globally via a kill-switch in the `.env` or Redis.
