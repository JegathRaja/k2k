# Design Governance

## Golden Rule
**Everything must use Design Tokens.** No exceptions.

## Mandatory Rules

### 1. No Hardcoded Colors
❌ `text-[#0A192F]`
❌ `bg-blue-900`
✅ `text-primary-900`
✅ `bg-primary-900`

### 2. No Hardcoded Spacing
❌ `mt-[15px]`
❌ `p-[10px]`
✅ `mt-4` (16px from token scale)
✅ `p-3` (12px from token scale)

### 3. No Hardcoded Shadows
❌ `shadow-[0_2px_4px_rgba(0,0,0,0.1)]`
✅ `shadow-card`
✅ `shadow-dropdown`

### 4. No Hardcoded Typography
❌ `text-[15px]`
❌ `font-['Open_Sans']`
✅ `text-bodyMedium font-body`
✅ `text-h1 font-heading`

## Usage Principles

1. **Consumer Marketplace, B2B Marketplace, and KadalOperations Portal must all consume from the same token system.**
2. Semantic scales (`success`, `warning`, `error`, `info`) must be used for statuses, NEVER raw primary or secondary colors.
3. The platform's visual identity must evoke a **Premium Marine Commerce Platform**. Rely heavily on the deep ocean navy, harbor blue, seafoam teal, and sand gold defined in our scales.
