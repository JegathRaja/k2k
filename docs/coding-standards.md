# Kadal2Kadaai — Coding Standards

## 1. General Principles

- **Readability Over Cleverness**: Code is read more often than it is written.
- **Single Responsibility**: Classes and methods should do one thing and do it well.
- **DRY (Don't Repeat Yourself)**: Extract common logic into traits, services, or hooks.
- **Strong Typing**: Use strict types in PHP and TypeScript everywhere.

## 2. PHP / Laravel Standards

### PHP 8.3+ Features
- Always declare `declare(strict_types=1);` at the top of every PHP file.
- Use constructor property promotion.
- Use named arguments for functions with many parameters.
- Use `readonly` classes for DTOs.
- Use match expressions instead of switch statements.
- Use backed enums instead of constants for statuses and types.

### Laravel Architecture
- **Controllers**: Thin controllers. They only handle HTTP requests and responses. No business logic.
- **Services**: All business logic goes here.
- **Repositories**: Database queries go here. Don't write Eloquent queries in controllers.
- **Form Requests**: All validation must be in FormRequest classes.
- **Resources**: All API responses must pass through API Resources (no returning Eloquent collections directly).

### Naming Conventions
- `PascalCase` for Classes, Interfaces, Traits, Enums.
- `camelCase` for methods and variables.
- `snake_case` for database columns and configuration keys.
- Append `Service` to services (e.g., `OrderService`).
- Append `Repository` to repositories (e.g., `OrderRepository`).
- Append `Controller` to controllers (e.g., `OrderController`).

## 3. TypeScript / Next.js Standards

### TypeScript
- Enable `strict: true` in `tsconfig.json`.
- Avoid `any`. Use `unknown` if you truly don't know the type.
- Prefer `interface` over `type` for object definitions.
- Export all types used in the API client to `src/types/`.

### React & Next.js
- Use Server Components by default. Add `'use client'` only when necessary (state, effects, event listeners).
- Use custom hooks to extract complex logic from components.
- Do not fetch data in `useEffect`. Use TanStack Query.
- Colocate components: If a component is only used by one feature, keep it inside that feature's folder.

### Tailwind & CSS
- Use design tokens (`bg-primary`, `text-muted`) instead of hardcoded colors (`bg-blue-600`).
- Combine classnames cleanly using `cn()` utility (clsx + tailwind-merge).

## 4. Git Flow

- **main**: Production branch. Always deployable.
- **develop**: Integration branch.
- **feature/***: New features. Branch off `develop`.
- **bugfix/***: Non-critical bug fixes. Branch off `develop`.
- **hotfix/***: Critical production fixes. Branch off `main`.

Commit messages should be descriptive: `feat: add user registration`, `fix: correct order total calculation`.
