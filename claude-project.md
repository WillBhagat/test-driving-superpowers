# Test Driving Superpowers

## Project Overview

Test Driving Superpowers is a Next.js application tailored for teams experimenting with autonomous driving features. It's built with modern web technologies and focuses on telemetry-driven workflows.

## Technology Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript 5.x with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Runtime**: React 19.2.0 with React DOM
- **Development**: ESLint with Next.js config
- **Database**: PostgreSQL (via Docker Compose)
- **Fonts**: Geist Sans & Geist Mono

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global Tailwind styles
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Landing page
│   └── favicon.ico        # App icon
└── [future directories]   # Components, lib, utils, etc.
```

## Development Setup

### Prerequisites
- Node.js (latest LTS)
- Docker (for PostgreSQL)

### Getting Started
1. Install dependencies: `npm install`
2. Start database: `docker compose up -d`
3. Start dev server: `npm run dev`
4. Open http://localhost:3000

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Coding Conventions

### TypeScript
- Strict mode enabled
- Use path aliases: `@/*` maps to `./src/*`
- Prefer explicit types over `any`
- Use React 19 patterns (no React imports needed in JSX files)

### React/Next.js
- Use App Router conventions
- Server Components by default
- Add 'use client' directive only when needed
- Export metadata from page components
- Use Next.js Image component for images

### Styling
- Tailwind CSS v4 for all styling
- Use utility classes over custom CSS when possible
- Font variables: `--font-geist-sans`, `--font-geist-mono`
- Follow responsive-first design principles

### File Naming
- React components: PascalCase (e.g., `UserProfile.tsx`)
- Pages: lowercase (e.g., `page.tsx`, `layout.tsx`)
- Utilities/libs: camelCase (e.g., `formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### Code Organization
- Group related functionality in feature folders
- Separate business logic from UI components
- Use custom hooks for stateful logic
- Keep components small and focused

## Architecture Patterns

### Component Architecture
- Server Components for data fetching and static content
- Client Components for interactive features
- Custom hooks for shared stateful logic
- Separate presentation from business logic

### Data Flow
- Server-side data fetching where possible
- Use React 19 features (Suspense, concurrent features)
- Implement error boundaries for graceful error handling
- Consider streaming for better UX

### Testing Strategy
- Unit tests for utility functions
- Component tests for UI logic
- Integration tests for critical user flows
- End-to-end tests for key scenarios

## Domain Context

This application focuses on autonomous driving and telemetry workflows. When implementing features, consider:

- **Telemetry Data**: Real-time vehicle sensor data, GPS coordinates, speed, acceleration
- **Autonomous Features**: Lane keeping, adaptive cruise control, parking assist
- **Safety Protocols**: Emergency braking, collision avoidance, driver alerts
- **Data Visualization**: Charts, maps, real-time dashboards
- **Vehicle States**: Manual, semi-autonomous, fully autonomous modes

## Performance Considerations

- Use Next.js Image optimization for vehicle photos/diagrams
- Implement proper caching strategies for telemetry data
- Consider Server Components for heavy data processing
- Use dynamic imports for large client-side components
- Optimize for real-time data updates where needed

## Security Guidelines

- Validate all telemetry data inputs
- Implement proper authentication for vehicle access
- Use HTTPS for all communications
- Sanitize data before database operations
- Follow OWASP guidelines for web security

## Database Conventions

- PostgreSQL as primary database
- Use proper indexes for telemetry queries
- Consider time-series optimizations for sensor data
- Implement proper data retention policies
- Use transactions for critical operations

## Deployment Notes

- Build artifacts go to `.next/`
- Static assets served from `public/`
- Environment-specific configs in `.env` files
- Docker Compose for local development database
- Consider containerization for production deployment