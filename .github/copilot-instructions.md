<!-- Copilot / AI agent instructions for the boteco.pt repo -->
# Copilot instructions — boteco.pt

Purpose: give AI coding agents the minimal, actionable knowledge to be productive in this Vite + React + TypeScript project.

Quick commands
- Install deps: prefer pnpm (repo contains pnpm-lock.yaml)
  - pnpm install
- Dev server (host/port configured in `vite.config.ts`):
  - pnpm dev   # runs `vite` (server bound to ::, port 8080)
- Build / preview:
  - pnpm build
  - pnpm preview
- Tests: node's built-in test runner (ESM .mjs tests):
  - pnpm test  # runs `node --test tests/**/*.test.mjs`
- Lint:
  - pnpm lint  # runs `eslint .`

Key architecture and bootstrapping
- Vite + React + TypeScript app. Entry: `src/main.tsx`.
  - `main.tsx` wires: Clerk auth (requires env), react-query, i18n, Helmet, ThemeProvider.
  - Missing Clerk publishable key will throw: add `VITE_CLERK_PUBLISHABLE_KEY` to your environment.
- Component structure:
  - Reusable UI primitives are under `src/components/ui/` (e.g. `button.tsx`, `input.tsx`).
  - Page-level components are under `src/pages/` and top-level layout/Seo under `src/components/`.
  - There are feature sections under `src/components/home/` and a `reactbits/` collection.
- Routing: `react-router-dom` and pages in `src/pages/` are the source of routes.

Project-specific conventions and patterns
- Path alias: `@/*` -> `src/*` (see `tsconfig.json` and `vite.config.ts`). Use `@/components/...` consistently.
- Styling: Tailwind is used via `globals.css` / `App.css`; follow existing Tailwind utility patterns.
- Component patterns: many UI primitives follow the shadcn/Radix + class-variance-authority approach. When adding variants, reuse `class-variance-authority` patterns already present in `src/components/ui/*`.
- Localization: i18n configured in `src/i18n.ts`. Translation content lives under `content/{en,pt,es,fr}`.
- Tests: test files are ESM `.mjs` in `tests/` and executed with Node's `--test` flag. Do not assume Jest syntax/plugins.

Integration points and external dependencies
- Clerk: authentication provider used in `src/main.tsx`. Requires `VITE_CLERK_PUBLISHABLE_KEY` (Vite env prefix).
- React Query: `@tanstack/react-query` used for data caching; QueryClient is supplied globally in `main.tsx`.
- Dyad: `@dyad-sh/react-vite-component-tagger` plugin is included in `vite.config.ts` — used for component tagging during dev.
- Radix UI primitives and many UI libs (see `package.json`) — prefer using existing UI primitives in `src/components/ui` rather than adding new low-level primitives.

Files to reference when editing or adding features
- Boot / env: `src/main.tsx`, `vite.config.ts`, `.env` (Vite envs)
- Scripts & deps: `package.json`
- Components: `src/components/`, especially `src/components/ui/` and `src/components/home/`
- Pages / routes: `src/pages/`
- i18n: `src/i18n.ts` and `content/` locales
- Tests: `tests/*.test.mjs`
- Example data: `public/data/contact-requests.json`

Small gotchas / do nots
- Use the `VITE_` prefix for client environment variables. The app will throw if `VITE_CLERK_PUBLISHABLE_KEY` is missing.
- Tests run with Node `--test` so imports should be ESM-compatible. Avoid CommonJS-only code in tests.
- The project uses a pnpm lockfile — prefer pnpm to keep the lockfile consistent.

How to propose & apply changes
- Make small, focused PRs; update or add tests under `tests/` to cover behavioral changes (follow existing test style: .mjs Node tests).
- When modifying UI primitives, update or add examples under `src/components/reactbits/` or the `home` sections so reviewers can sanity-check visuals.

If anything is unclear
- Ask the human reviewer for missing env values (Clerk publishable key) or design guidance for new UI variants.

— End of instructions —

Please review and tell me any missing specifics you want included (CI, deployment, or contributor policies).
