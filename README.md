## Test Driving Superpowers

Test Driving Superpowers is a Next.js starter tailored for teams experimenting with autonomous driving features. It ships with the App Router, TypeScript, Tailwind CSS, and an opinionated landing page that highlights telemetry-focused workflows.

## Getting Started

Install dependencies (already done if you ran the scaffold command):

```bash
npm install
```

Start the development server and open http://localhost:3000:

```bash
npm run dev
```

Edit `src/app/page.tsx` to update the landing page messaging. Changes hot-reload instantly.

## Database (Docker + Postgres)

Provision a local Postgres instance with Docker Compose:

```bash
docker compose up -d
```

Configuration defaults:

- Database: `test_driving_superpowers`
- User: `app_user`
- Password: `app_password`
- Port: `5432`

Copy `.env.example` to `.env.local` and adjust credentials if you change the compose defaults. The Next.js app can access Postgres via `DATABASE_URL`.

## Useful Scripts

- `npm run dev` - start Next.js in development mode with hot reloading.
- `npm run lint` - run ESLint checks using the Next.js shareable config.
- `npm run build` - create an optimized production build.
- `npm run start` - serve the production build locally.

## Project Notes

- Tailwind CSS is preconfigured via `postcss.config.mjs` and `tailwind.config.ts`.
- Import aliases use `@/*`, defined in `tsconfig.json`.
- The landing page includes example feature cards you can replace with real data sources.

For framework details, review the [Next.js documentation](https://nextjs.org/docs).
