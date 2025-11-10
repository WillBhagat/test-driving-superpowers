# Monolithic Customer Manager Implementation Plan

> **For Claude:** Use `${UNI_SKILLS_ROOT}/skills/collaboration/executing-plans/SKILL.md` to implement this plan task-by-task with hierarchical agent isolation.

**Goal:** Build a single 500+ line React component that handles all customer CRUD operations, data fetching, form validation, local storage caching, and UI rendering.

**Architecture:** Monolithic component architecture with internal service functions organized at the top of the file. Service functions (apiService, storageService, validationService) are defined as plain JavaScript objects within the same file. All state management, effects, handlers, and UI rendering logic contained in one component.

**Tech Stack:** React (hooks), TypeScript, localStorage API, mock REST API simulation

**Task Execution Model:** Each task number will be assigned to a dedicated agent with isolated context.

## Task Overview

Brief description of each main task and execution order:

### Task 1: TypeScript Interfaces and Mock API Service
- **File:** `task1.md`
- **Purpose:** Define data contracts and simulate backend API with realistic delays
- **Depends On:** None
- **Subtasks:** 2 subtasks (files: `task1.1.md`, `task1.2.md`)

### Task 2: Storage and Validation Services
- **File:** `task2.md`
- **Purpose:** Implement localStorage caching and form validation logic
- **Depends On:** Task 1 (Customer interface)
- **Subtasks:** 2 subtasks (files: `task2.1.md`, `task2.2.md`)

### Task 3: Main Component State and Data Loading
- **File:** `task3.md`
- **Purpose:** Set up component state hooks and implement initial data loading flow
- **Depends On:** Task 1, Task 2
- **Subtasks:** 2 subtasks (files: `task3.1.md`, `task3.2.md`)

### Task 4: CRUD Event Handlers
- **File:** `task4.md`
- **Purpose:** Implement all customer create, update, delete operations
- **Depends On:** Task 1, Task 2, Task 3
- **Subtasks:** 3 subtasks (files: `task4.1.md`, `task4.2.md`, `task4.3.md`)

### Task 5: UI Rendering Logic
- **File:** `task5.md`
- **Purpose:** Implement complete UI with error handling, loading states, and inline editing
- **Depends On:** Task 3, Task 4
- **Subtasks:** 3 subtasks (files: `task5.1.md`, `task5.2.md`, `task5.3.md`)

## Execution Order

1. Task 1 → Task 1.1, Task 1.2 (sequential)
2. Task 2 → Task 2.1, Task 2.2 (can run in parallel after Task 1)
3. Task 3 → Task 3.1, Task 3.2 (sequential, after Task 1 and Task 2)
4. Task 4 → Task 4.1, Task 4.2, Task 4.3 (sequential, after Task 3)
5. Task 5 → Task 5.1, Task 5.2, Task 5.3 (sequential, after Task 4)

**Note:** All code lives in a single file `src/components/CustomerManager.tsx` (~500-550 lines). Each task builds upon the same file incrementally.

---
