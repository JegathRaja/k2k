# CMS Governance Constitution

This document defines content management rules, specifying what is strictly developer-controlled versus dynamically editable by Administrators or Sellers.

## 1. Control Matrix

### What Admin Can Edit
- Global Platform Banners
- FAQ Content
- Privacy Policy, Terms & Conditions
- Commission Rates (via Admin Panel)
- Featured Categories & Featured Products placements on Homepage
- SEO Meta Tags for static pages

### What Seller Can Edit
- Shop Name, Shop Description, Logo, Banner
- Product Title, Description, Price, Stock
- Seller operating hours

### What Developer Controls (Code-Level)
- Core layout structure
- Navigation routing
- Payment Gateway Integrations
- Core transaction flows

## 2. Forbidden Hardcoding Rules
- **NEVER hardcode pricing tiers, commission percentages, or tax rates** directly in the code.
- **NEVER hardcode phone numbers or support emails** in the UI. These must come from `.env` or the DB settings table.
- **NEVER hardcode promotional banners or alert messages**.

## 3. Specific Content Rules
- **Homepage Content Rules**: The main carousel, featured grids, and top-selling sections must be fully data-driven.
- **Banner Rules**: Banners must support start/end timestamps and an `is_active` toggle.
- **SEO Rules**: All product and category pages must generate dynamic Title and Meta Description tags using DB content.
- **Landing Page / Marketing Rules**: Custom landing pages should be constructed via headless CMS or DB-driven sections, not hardcoded HTML files.
- **Footer Rules**: Social links, app download links, and copyright years must be dynamic or auto-updating.

## 4. Content Approval Rules
- Changes to Critical System Settings by Admins require a secondary confirmation or audit log trail.
- Seller products are subject to Admin approval if the system mandates `require_product_approval`.
