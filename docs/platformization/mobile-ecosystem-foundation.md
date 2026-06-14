# Mobile Ecosystem & Extensibility Architecture

## 1. Mobile App Foundation
The ecosystem will scale into multiple dedicated mobile applications using a unified React Native / Expo monorepo structure.
- **Customer App**: Highly optimized for B2C conversions, offline caching, and push notifications.
- **Seller App**: Focused on rapid inventory updates, camera integration for product uploads, and real-time order alerts.
- **Admin App / Delivery App**: Internal tools utilizing shared auth and API client packages.
- **Shared Architecture**: All apps share the core `@kadal/design-system` (React Native variants), `@kadal/api-client`, and `@kadal/validators` packages to ensure parity with the web experience.

## 2. Platform Marketplace Ecosystem
KadalOperations is architected to be modular. Future business models can be "plugged in" without disrupting the core B2C/B2B marketplace.
- **Auction Marketplace**: Supporting real-time bidding for rare high-value catches directly at Fish Landing Centers.
- **Cold Storage Marketplace**: Allowing 3rd parties to rent unused cold storage space.
- **Logistics Marketplace**: A load-board for independent refrigerated truck owners to bid on inter-city transit routes.
- **Implementation Constraint**: These are NOT built currently, but the underlying database schema utilizes a polymorphic `MarketplaceModuleID` pattern allowing seamless future integrations.
