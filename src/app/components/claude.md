# CLAUDE.md: Component Library Project Configuration

This file provides persistent context and guidelines for all Claude Code interactions with the design system repository.

## IMPORTANT RULES

These rules are non-negotiable and must be followed for all code generation, refactoring, and review.

1.  **TypeScript First:** All new components, hooks, and utilities must be written in **TypeScript** (`.tsx` or `.ts`). Use explicit types for all component props.
2.  **Accessibility (A11y):** All components must adhere to **WCAG 2.1 AA standards**. Use semantic HTML, ARIA attributes, and ensure keyboard navigation works correctly.
3.  **No Unnecessary State:** Components must be kept as **stateless/pure** as possible. State logic must be extracted into custom hooks or kept in the consuming application, not the library component itself.
4.  **Prop Clarity:** Component prop interfaces must be designed for **minimalism and clear intent**. Avoid generic props like `data`—use specific names like `users` or `items`.


## PROJECT CONTEXT

### Technology Stack
* **Framework:** React 18
* **Language:** TypeScript
* **Styling:** Styled Components (preferred) or Emotion (as an alternative). Do **not** use global CSS or CSS Modules unless explicitly creating a low-level utility.
* **Tooling:** Vite / Rollup for bundling (outputs `cjs`, `esm`, and type definitions).
* **Testing:** Jest and **React Testing Library (RTL)**.

### Component Philosophy
This is a **Design System Component Library**. Focus on **composition over inheritance**. Components should be small, single-purpose, and fully typed.

### Directory Structure
Components are organized into categories under `/src`. Any component intended for public export must be listed in `src/index.ts`.

```
/src
├── /components
│   ├── /layout      \# Containers, Grids, Stacks
│   ├── /forms       \# Button, Input, Checkbox
│   └── /data        \# Card, Avatar, Badge
├── /hooks           \# Custom React Hooks
├── /styles          \# Theme configuration, GlobalStyles
├── /types           \# Shared TypeScript types
└── index.ts         \# Main export file (critical for bundling)
```


## DEVELOPMENT PATTERNS

### Component Implementation
* **Naming:** Use **PascalCase** for component file names (`Button.tsx`) and **camelCase** for internal functions/variables.
* **Styling Convention:** All component styles must be defined in a **separate file** named `[Component].styled.ts` and imported into the component file.
* **Memoization:** Always use `React.memo` for pure, non-stateful components, and use `useCallback`/`useMemo` for complex callbacks and values to maintain rendering performance.

### Testing Strategy
* **Location:** Test files must be named `[Component].test.tsx` and placed alongside the component file (e.g., `src/components/forms/Button/Button.test.tsx`).
* **Goal:** Tests must primarily verify **user behavior** using RTL (e.g., testing that a button is disabled, or that a user can type into an input).
* **Mocks:** Use `jest.mock` when necessary, particularly for mocking third-party libraries.

### Common Development Commands

| Command | Purpose |
| :--- | :--- |
| `npm run install` | Install all dependencies. |
| `npm run build` | Builds the library for distribution (`/dist` folder). **Must run before publishing.** |
| `npm run storybook`| Starts the local Storybook documentation server. |
| `npm run test` | Runs all Jest/RTL unit tests with code coverage report. |
| `npm run lint:fix`| Fixes all ESLint and Prettier errors. |

## STYLE GUIDELINES (Styled Components)

### Theme Access
Access to design tokens (colors, spacing, typography) is done exclusively through the `theme` prop provided by `styled-components`.

**Example:**
```typescript
const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;
```

### Component Structure Example

For generating a new component (e.g., `Tooltip`), use this three-file structure:

1.  `Tooltip.tsx` (Component logic and exports)
2.  `Tooltip.styled.ts` (Styled components definition)
3.  `Tooltip.test.tsx` (RTL tests)