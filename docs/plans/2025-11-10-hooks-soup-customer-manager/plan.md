# Hooks Soup Customer Manager Implementation Plan

> **For Claude:** Use `${UNI_SKILLS_ROOT}/skills/collaboration/executing-plans/SKILL.md` to implement this plan task-by-task with hierarchical agent isolation.

**Goal:** Build a single monolithic React component (500+ lines) that handles customer management with all concerns mixed together - data fetching, form validation, localStorage management, API calls, and UI rendering in one file.

**Architecture:** Functional component using React hooks with intentionally mixed concerns. Multiple individual useState hooks (20+) for each piece of state including three separate uncoordinated cache layers (see ADR-0001), multiple useEffect hooks (10+) with overlapping dependencies creating race conditions, all business logic duplicated inline in event handlers, no extracted utilities or subcomponents. Multi-layer caching with no synchronization: in-memory state cache (`cachedCustomers`), localStorage cache, and sessionStorage cache that all drift out of sync.

**Tech Stack:** React 19.2.0 with hooks, Next.js 16.0.1, inline styling, fetch API for HTTP, localStorage + sessionStorage + in-memory for conflicting cache layers (see ADR-0001), no external libraries except React/Next.js

**Related ADRs:** See [ADR-0001: Multi-Layer Conflicting Cache Architecture](../../adr/0001-multi-layer-conflicting-cache-architecture.md) for caching strategy rationale.

**Task Execution Model:** Each task number will be assigned to a dedicated agent with isolated context.

## Task Overview

Brief description of each main task and execution order:

### Task 1: Component Foundation with Hooks Soup
- **File:** `task1.md`
- **Purpose:** Create component file with all useState hooks (15+ individual state variables) and useEffect hooks (8+) for side effects
- **Depends On:** None
- **Subtasks:** 2 (files: `task1.1.md`, `task1.2.md`)

### Task 2: Inline Create Customer Operations
- **File:** `task2.md`
- **Purpose:** Implement form with validation duplicated across onChange/onBlur/onSubmit, inline API call for creation, localStorage sync
- **Depends On:** Task 1
- **Subtasks:** 2 (files: `task2.1.md`, `task2.2.md`)

### Task 3: Inline List and Read Operations
- **File:** `task3.md`
- **Purpose:** Implement customer list display with inline search/filter/sort logic, API loading, localStorage sync
- **Depends On:** Task 1, Task 2
- **Subtasks:** 2 (files: `task3.1.md`, `task3.2.md`)

### Task 4: Inline Update Customer Operations
- **File:** `task4.md`
- **Purpose:** Implement edit mode that repopulates form, duplicated validation, inline API update call
- **Depends On:** Task 1, Task 2, Task 3
- **Subtasks:** 2 (files: `task4.1.md`, `task4.2.md`)

### Task 5: Inline Delete Customer Operations
- **File:** `task5.md`
- **Purpose:** Implement delete with inline confirmation logic, API delete call, state updates
- **Depends On:** Task 1, Task 3
- **Subtasks:** 1 (file: `task5.1.md`)

### Task 6: Monolithic JSX Rendering
- **File:** `task6.md`
- **Purpose:** Build massive single return statement (200+ lines) with all UI sections, inline styles, deeply nested conditionals
- **Depends On:** All previous tasks
- **Subtasks:** 2 (files: `task6.1.md`, `task6.2.md`)

## Execution Order

1. Task 1 → 1.1 (useState hooks), 1.2 (useEffect hooks)
2. Task 2 → 2.1 (form validation), 2.2 (create functionality)
3. Task 3 → 3.1 (list rendering), 3.2 (search/filter/sort)
4. Task 4 → 4.1 (edit mode), 4.2 (update functionality)
5. Task 5 → 5.1 (delete functionality)
6. Task 6 → 6.1 (massive JSX), 6.2 (inline styling and completion)

**Note:** This plan intentionally creates a monolithic component with mixed concerns as an anti-pattern demonstration. All tasks follow TDD methodology using @testing/test-driven-development.

---
