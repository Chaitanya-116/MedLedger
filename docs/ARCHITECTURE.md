# MedLedger Architecture & Engineering Guidelines

This document outlines the architectural patterns, clean coding standards, and design system choices implemented in **MedLedger**.

## Architectural Principles

### 1. Clean & Layered Architecture
- **Separation of Concerns**: UI rendering, business logic, data persistence, and API transport layers are strictly decoupled.
- **Dependency Inversion**: High-level modules do not depend on low-level modules; both depend on abstractions (interfaces / base classes / schemas).
- **Single Responsibility Principle (SRP)**: Each component, service, hook, or repository has one clear purpose.

### 2. Frontend Architecture (React + Vite + TypeScript)
- **Feature-Based & Layered Mix**: Global shared UI components (`common/`, `layout/`, `ui/`) handle styling, while feature modules (`features/`) contain domain-specific state, components, and logic.
- **Design System Integration**: Material UI (MUI v6) configured with Material 3 styling tokens (`#2E7D32` primary green, `#1976D2` secondary blue, `#F7F8FA` neutral background, 16px border-radius) seamlessly combined with Tailwind CSS for utility layout styling.
- **Strict Data Contracts**: Axios client with centralized interceptors, type-safe API requests, and Zod schema validations for form controls and data transformations.
- **Server State vs Client State**: TanStack Query manages server state caching, invalidation, and background updates; React Context or local state manages UI interaction state.

### 3. Backend Architecture (FastAPI + SQLAlchemy + Pydantic)
- **Router Layer (`app/routers/`)**: Receives HTTP requests, validates request payloads with Pydantic, calls services/dependencies, and returns response schemas.
- **Service Layer (`app/services/`)**: Implements pure domain logic without direct knowledge of HTTP status codes or database queries.
- **Repository Layer (`app/repositories/`)**: Encapsulates DB queries using SQLAlchemy 2.0 select/insert patterns.
- **Database Layer (`app/database/`)**: Manages DB engine initialization, async/sync sessions, connection pooling, and base model declarative classes.
- **Migration Layer (`alembic/`)**: Version-controlled database schema migrations.

---

## Coding Standards

1. **Strict Type Safety**: All TypeScript code must use strict types without resorting to `any`.
2. **Small & Readable Files**: Keep files concise (< 200 lines where possible).
3. **Immutability & Pure Functions**: Prefer functional transformations over state mutation.
4. **Error Handling**: Graceful error handling in backend routers and centralized error boundary / toast notification system on frontend.
