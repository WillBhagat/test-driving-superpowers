---
version: 1
actions:
  - type: scaffold
    from: ".claude/templates/example-feature"
    to: "src/example-feature"
    overwrite: false

  - type: patch
    file: "src/config/example-config.ts"
    patch: |
      --- a/src/config/example-config.ts
      +++ b/src/config/example-config.ts
      @@ -1 +1 @@
      -export const featureEnabled = false;
      +export const featureEnabled = true;

  - type: npm-deps
    add:
      - "some-shared-lib@^1.0.0"
---
# Notes
This repo opted in to code generation.

## Development Guidelines

### File Structure
```
src/
  app/              # Next.js App Router files
    layout.tsx      # Root layout
    page.tsx        # Home page
    globals.css     # Global styles
    api/            # API routes (when needed)
  components/       # Reusable React components (create if needed)
  lib/              # Utility functions and configurations (create if needed)
  types/            # TypeScript type definitions (create if needed)
```

### Code Style
- Use ESLint configuration (eslint-config-next)
- Follow existing code formatting and style
- Use meaningful component and variable names
- Keep components focused and reusable
- Use TypeScript interfaces for complex data structures

### Environment Setup
- Development: `npm run dev` (available as VS Code task)
- Build: `npm run build`
- Linting: `npm run lint`
- Database: `docker-compose up db` to start PostgreSQL

### Best Practices
1. **Performance**: Leverage Next.js built-in optimizations
2. **Accessibility**: Ensure components are accessible (ARIA labels, semantic HTML)
3. **SEO**: Use Next.js metadata API for proper SEO
4. **Error Handling**: Implement proper error boundaries and handling
5. **Testing**: Write Jest based unit tests
6. **Security**: Follow Next.js security best practices

## Dependencies Management
- Use npm for package management
- Keep dependencies up to date with project requirements
- Add new dependencies thoughtfully, considering bundle size
- Prefer built-in Next.js/React solutions over external libraries when possible

## Docker Services
- Database runs in Docker container
- PgAdmin available for database management
- Use `docker-compose up` to start services
- Database data persists in Docker volumes

## Common Tasks
- Adding new pages: Create in `src/app/[route]/page.tsx`
- Adding components: Create in `src/components/` (create directory if needed)
- API endpoints: Create in `src/app/api/[endpoint]/route.ts`
- Styling: Use Tailwind classes, global styles in `globals.css`
- Testing: Follow Karma testing patterns and run through Karma test runner

## Important Notes
- This is a dummy/test project designed to be modified by external tools
- Maintain the existing project structure and conventions
- Focus on demonstrating best practices for the frameworks used
- Keep changes well-documented and follow established patterns