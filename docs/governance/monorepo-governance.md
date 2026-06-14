# Monorepo Governance Constitution

This document defines the workspace rules if Kadal2Kadaai scales into a Monorepo architecture (e.g., using Turborepo or Nx).

## 1. Workspace Structure
- `/apps/`: Contains deployable applications (`admin-panel`, `seller-panel`, `consumer-web`, `api-server`).
- `/packages/`: Contains shared internal libraries (`ui`, `config`, `utils`, `types`, `database`).

## 2. Package Ownership & Import Rules
- Applications in `/apps/` cannot import directly from each other. (e.g., `consumer-web` cannot import from `seller-panel`).
- Shared code must be extracted to `/packages/` and imported via NPM workspace links (e.g., `import { Button } from '@kadal/ui'`).

## 3. Dependency Direction Rules
- `/apps/` depends on `/packages/`.
- `/packages/` CANNOT depend on `/apps/`.
- Circular dependencies between packages are strictly forbidden and must be blocked by linters.

## 4. Shared Package Rules
- Shared UI packages must not contain business logic. They are "dumb" components.
- Versioning Rules: All internal packages use unified versioning (managed via Changesets or Lerna).

## 5. Build Rules & Release Rules
- Builds must be cached (e.g., Turborepo cache).
- CI must only build and test the workspaces affected by a given PR.
- Deployments happen sequentially or concurrently based on the dependency graph.
