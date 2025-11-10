# Task 6.2: Inline Styling Objects and 500+ Line Completion

**Agent Context:** You're adding inline styling to the massive JSX from Task 6.1 using style objects defined in the render method, duplicating style definitions, and pushing the component over 500 total lines to complete the monolithic anti-pattern demonstration.

**Behavior:** Define inline style objects in the render method (before return statement) for all UI elements, with duplicated styles for similar elements, conditional styling with ternaries, and no CSS files or styled-components. Ensure the complete component file exceeds 500 lines.

**Acceptance Criteria:**
- Given the component with massive JSX from Task 6.1
- When inline style objects and styling attributes are added
- Then the component should have:
  - Style objects defined at top of render method (before return)
  - Separate style objects for: header, form, input, button, table, tableRow, error, success, modal, overlay, spinner
  - Duplicated styles for similar elements (e.g., primaryButton and submitButton with same styles)
  - Conditional styling with spread and ternaries: `style={{...baseButton, ...(isEditing ? editStyle : {})}}`
  - Inline conditional styles: `style={{color: nameError ? 'red' : 'black'}}`
  - No CSS modules, no styled-components, no external CSS files
  - Hover states attempted with inline styles (doesn't work well)
  - Magic numbers for spacing, colors, sizes (no design system)
- And component file exceeds 500 total lines:
  - ~20+ lines: imports and component declaration
  - ~25+ lines: useState hooks (20+ hooks)
  - ~40+ lines: useEffect hooks (10+ hooks)
  - ~100+ lines: functions (handleCreate, handleUpdate, handleDelete, handleEdit, validation, etc.)
  - ~50+ lines: inline style objects (duplicated)
  - ~250+ lines: massive JSX return statement with style attributes
  - Total: 485+ lines, add more style variants to exceed 500
- And line count verified (must exceed 500)

**Test Scenarios:**
- Happy path: All elements have inline styles applied, component renders with styling
- Style application: Buttons, inputs, table, modal all have visual styling
- Conditional styling: Edit button shows different style when in edit mode
- Error styling: Invalid fields show red borders and red error text
- Loading styling: Spinner and overlay cover page with proper z-index
- Modal styling: Delete modal centered, has backdrop, proper layering
- Responsive failure: No media queries, breaks on mobile (intentional)
- Style duplication: Multiple elements have same hardcoded colors/spacing
- Line count: Component file exceeds 500 lines total

**Agent-Specific Context:**
- Files to edit: `src/app/customers/page.jsx`
- Tests to update: `src/app/customers/__tests__/page.test.jsx`
- Dependencies available: Complete component from Tasks 1-6.1
- Interfaces to provide: Final complete monolithic component (500+ lines, all anti-patterns)

**Architecture Constraints:**
- Style objects defined in component render (recalculated every render)
- No memoization of style objects (performance issue)
- Hardcoded colors: '#3b82f6', '#ef4444', '#10b981', etc.
- Hardcoded spacing: '8px', '16px', '24px' (no design tokens)
- Style duplication for similar elements
- Conditional styling with object spread and ternaries
- No CSS-in-JS library (just React inline styles)
- File must exceed 500 lines total (add more style variants if needed)

**Definition of Done:**
- Inline style objects added for all elements
- All JSX elements have style attributes
- Styles include conditional logic
- Component file exceeds 500 lines (verified with line count)
- Tests verify component renders with styling
- Tests verify conditional style changes
- All tests pass following @testing/test-driven-development
- Component complete: 500+ line monolithic anti-pattern with all issues:
  - 20+ useState hooks
  - 10+ useEffect hooks with race conditions
  - Three unsynced cache layers
  - Duplicated validation logic
  - Inline fetch API calls
  - Massive single JSX return
  - Duplicated inline styles
  - No extracted components or utilities
