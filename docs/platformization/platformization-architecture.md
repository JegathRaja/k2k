# Platformization & Multi-Region Architecture

## 1. Multi-Region Foundation
KadalOperations is designed to expand horizontally across borders.
- **Geographic Modeling**: Every entity (Users, Sellers, Products, Orders) MUST be linked to a `RegionID` and `CountryID`.
- **Localization**: Pricing supports dynamic currency conversions. Taxes apply dynamically based on the destination `RegionID` (e.g., Tamil Nadu CGST/SGST vs Kerala CGST/SGST).
- **Logistics Segregation**: Sellers in Karnataka cannot be surfaced to buyers in Andhra Pradesh unless cross-state shipping is explicitly authorized and handled by regional 3PL networks.

## 2. Multi-Tenant Architecture
The ecosystem supports Enterprise B2B SaaS operations. 
- **Tenant Isolation**: Row-Level Security (RLS) is applied at the database level using `tenant_id`. Kadal2Kadaai is Tenant `0000-0000-0000-0000`. Future tenants (e.g., external B2B partners utilizing the engine) will operate in full isolation.
- **Tenant Configuration**: Branding tokens (Primary colors, Logos) and operational rules (Commission percentages, available roles) are injected at runtime via a centralized `TenantConfig` object.

## 3. Ecosystem API Platform
To support a global ecosystem of partners, KadalOperations exposes a secure Public API.
- **Developer Portal**: External 3PL partners, ERP systems, and Accounting software can generate API keys.
- **Authentication**: OAuth 2.0 (Client Credentials flow) is required for server-to-server integrations.
- **Versioning**: Enforced strict path versioning (`/api/v2/...`). Breaking changes require at least 180 days of deprecation notice via Webhook.
