# 0001. Multi-Layer Conflicting Cache Architecture for Customer Manager

Date: 2025-11-10

## Status

Proposed on 2025-11-10

## Context

The Hooks Soup Customer Manager component is being designed as a deliberate anti-pattern demonstration to illustrate problematic architectural decisions and their consequences. As part of this educational exercise, we need to demonstrate how poorly-managed caching strategies can create system instability, data inconsistency, and race conditions.

Modern applications often use multiple caching layers to improve performance, but without proper coordination and invalidation strategies, these caches can become sources of significant problems. This component will serve as a cautionary example of what happens when cache layers are implemented without consideration for consistency, synchronization, or proper invalidation.

## Decision

We will implement three separate, uncoordinated cache layers for customer data within a single React component:

1. **In-Memory Component State Cache** (`cachedCustomers`)
   - Separate state variable from the primary `customers` state
   - Populated from API responses but never properly synchronized with `customers`
   - No invalidation strategy - data remains stale indefinitely

2. **localStorage Cache**
   - Persists customer data across browser sessions
   - Updated asynchronously via useEffect hooks with race conditions
   - No version control or expiration mechanism
   - May contain customers that no longer exist in the API

3. **sessionStorage Cache**
   - Stores additional metadata (search history, sort preferences, partial form data)
   - Separate from both in-memory and localStorage
   - No coordination with other cache layers
   - May reference customer IDs that don't exist in other caches

**Architectural Characteristics:**
- No cache invalidation strategy across layers
- No synchronization mechanism between caches
- Multiple useEffect hooks with overlapping dependencies attempting to manage caches
- Race conditions between cache updates and API responses
- Stale data served from caches even after successful updates
- No error handling for storage quota exceeded or access denied

## Consequences

### Negative Consequences (Intentional)

**Data Consistency Issues:**
- Users may see different customer data depending on which cache is accessed
- Updates may appear to succeed but show stale data on refresh
- Delete operations may remove from one cache but not others
- Search results may include deleted customers from stale caches

**Race Conditions:**
- Rapid user actions trigger competing cache updates
- useEffect hooks fire in unpredictable order
- API responses may arrive after cache has been updated from different source
- Multiple sources of truth with no conflict resolution

**Performance Degradation:**
- Unnecessary localStorage/sessionStorage reads on every render
- Multiple cache checks before accessing data
- Memory leaks from caches that grow unbounded
- Browser storage quota exhaustion over time

**Debugging Complexity:**
- Difficult to trace which cache served which data
- State mutations from multiple useEffect hooks hard to track
- Time-dependent bugs that are difficult to reproduce
- No logging or observability into cache hits/misses

**User Experience Problems:**
- Confusing behavior where actions don't appear to work
- Data appearing and disappearing unpredictably
- Form fields populated with stale data during edits
- Search results that don't match actual data

### Positive Consequences (Educational Value)

**Learning Outcomes:**
- Clear demonstration of cache coherency problems
- Illustrates why cache invalidation is "one of the two hard problems"
- Shows consequences of missing synchronization strategies
- Provides concrete examples for refactoring exercises
- Demonstrates why proper state management patterns exist

**Refactoring Opportunities:**
- Can be used to teach proper cache invalidation patterns
- Demonstrates value of single source of truth
- Shows when to use proper state management libraries
- Illustrates importance of architectural planning

## Alternatives

### Alternative 1: Single Cache Layer with Proper Invalidation
**Rejected because:** This would be correct architecture and defeat the educational purpose. We specifically want to demonstrate problematic multi-layer caching.

### Alternative 2: No Caching
**Rejected because:** While this would eliminate cache consistency problems, it wouldn't demonstrate the specific anti-pattern of conflicting cache layers that developers encounter in real systems.

### Alternative 3: Multi-Layer with Proper Synchronization
**Rejected because:** Implementing proper cache-aside pattern, write-through caching, or other coordination strategies would be good architecture. The goal is to show what happens WITHOUT these patterns.

## Notes

**Review Audiences:**
- This ADR is primarily for educational review by developers learning about architectural anti-patterns
- Engineering teams reviewing this as a "what not to do" example
- Code reviewers evaluating the intentional technical debt

**Implementation Notes:**
- This architecture is deliberately problematic and should NOT be used in production systems
- The component serves as a teaching tool for refactoring exercises
- All cache-related bugs and race conditions are intentional features of the design
- Documentation should clearly mark this as an anti-pattern demonstration

**Warning:**
Any team considering similar architecture in production should instead:
- Use a single source of truth (e.g., React Query, SWR, Redux with proper middleware)
- Implement proper cache invalidation strategies
- Use time-based expiration with staleness indicators
- Consider server-driven cache invalidation (webhooks, SSE, WebSockets)
- Use proper state management libraries designed for this purpose
