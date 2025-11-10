# Task 5.1: Implement Error Alert and Loading Spinner

**Agent Context:** You are implementing the top-level UI elements that show loading states and error messages to users.

**Behavior:** Create JSX rendering logic that displays error alerts when errors exist and a loading spinner during data fetching.

**Acceptance Criteria:**
- Given the component needs to show status to users
- When rendering the component
- Then if loading is true, display a loading spinner or "Loading..." text
- And if error exists, display an error alert with the error message
- And error alert includes a dismiss button that clears error state
- And error alert includes a "Retry" button that reloads data
- And error alert is displayed above other content
- And loading spinner is displayed instead of table during initial load

**Test Scenarios:**
- **Loading state:** Shows loading indicator when loading is true
- **Error state:** Shows error message when error is not null
- **Dismiss error:** Clicking dismiss clears error state
- **Retry:** Clicking retry reloads data from API
- **Both loading and error:** Loading takes precedence (or show error above loading)
- **No error, not loading:** Shows normal content

**Agent-Specific Context:**
- **File to modify:** `src/components/CustomerManager.tsx` (replace return statement)
- **Tests to create:** None for this subtask (will be tested through integration)
- **Dependencies available:** State (loading, error) from Task 3.1, data loading logic from Task 3.2
- **Interfaces to provide:** Error and loading UI that wraps main content

**Architecture Constraints:**
- Replace existing return statement with complete JSX
- Structure: outer div → error alert (if error) → loading spinner (if loading) → content (else)
- Error alert: red/orange background, error message, dismiss X button, retry button
- Loading: simple "Loading customers..." text or spinner
- Use semantic HTML (div, button, etc.)
- Inline styles or className for basic styling
- handleDismissError: clears error state
- handleRetry: resets loading to true, calls data loading logic
- Early return pattern: if loading, return spinner; if error, show error

**Definition of Done:**
- Component return statement replaced with complete JSX
- Error alert displayed when error exists
- Error alert has dismiss and retry functionality
- Loading spinner displayed when loading is true
- Basic styling applied for visibility
- handleDismissError and handleRetry handlers defined
- TypeScript compiles without errors
