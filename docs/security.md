# Kadal2Kadaai — Security Checklist

## 1. Application Security

- [x] **Rate Limiting**: Enforced on all API endpoints (especially login and OTP routes).
- [x] **CORS**: Restricted to the exact frontend domain.
- [x] **CSRF**: Handled by Sanctum.
- [x] **XSS**: Handled by React (frontend escapes by default) and Laravel's strict API JSON responses.
- [x] **SQL Injection**: Prevented by Eloquent ORM. No raw queries allowed without bindings.
- [x] **Mass Assignment**: Laravel `$fillable` is strict on all models.

## 2. Server & Infrastructure

- [x] **HTTPS Only**: Enforced at the Cloudflare edge.
- [x] **HSTS**: Strict-Transport-Security header enabled.
- [x] **Firewall**: UFW enabled on Hetzner VPS, allowing only ports 80, 443, and 22.
- [x] **Database Exposure**: PostgreSQL bound to `127.0.0.1` or private network, NOT `0.0.0.0`.
- [x] **Redis Security**: Redis protected by a strong password and bound to local network.

## 3. Data Protection

- [x] **Password Hashing**: Argon2 or Bcrypt used for all passwords.
- [x] **Audit Trail**: Immutable `audit_logs` table records all critical actions (login, order status changes, settings updates).
- [x] **Soft Deletes**: Used for critical business data (users, orders) to prevent accidental data loss and maintain historical referential integrity.

## 4. Headers (via SecurityHeaders Middleware)

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: default-src 'none'` (API)
