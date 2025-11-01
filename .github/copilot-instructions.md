# Boteco.pt AI Coding Instructions

## Architecture Overview

**Boteco Pro** is a multilingual (pt/en/es/fr) React SPA for restaurant management built with:
- **Vite + React 18 + TypeScript** with SWC compilation
- **React Router v6** with locale-aware routing pattern: `/:locale/path`
- **i18next** for internationalization with JSON content files per locale
- **shadcn/ui** (Radix + Tailwind) + **React Bits** registry for UI components
- **next-themes** for persistent dark/light theme support
- **Optional Clerk authentication** (feature-flagged via `VITE_CLERK_PUBLISHABLE_KEY`)
- **TanStack Query** for data fetching with localStorage fallback layer

## Critical Patterns

### 1. Routing Architecture (src/App.tsx)
Routes MUST follow the locale-aware pattern. All new routes go under `/:locale`:

```tsx
<Route path="/:locale" element={<LocaleWrapper />}>
  <Route path="nova-funcionalidade" element={<NovaFuncionalidade />} />
</Route>
```

**Never** add routes outside this structure except for protected routes like `/painel`. Root `/` redirects to `/pt`.

### 2. Content Structure (src/content/)
All user-facing text lives in JSON files organized by:
- `src/content/{locale}/{page}.json` - Page-specific translations
- `src/content/common/navigation.json` - Shared navigation with multi-locale labels

**Pattern**: Create new pages? Add corresponding JSON files in all 4 locales (pt/en/es/fr).

```typescript
// In component:
const { t } = useTranslation('page-name'); // Namespace matches filename
const text = t('section.key');
```

### 3. Theme System (Boteco Custom Colors)
Uses **dual theming strategy**:
- Boteco brand colors: `boteco-primary`, `boteco-secondary`, `boteco-tertiary`, `boteco-neutral` (see `src/globals.css`)
- shadcn semantic tokens: `background`, `foreground`, `primary`, `card`, etc.

**Dark mode** toggles HSL values in `:root` vs `.dark` classes. All colors use CSS variables. Never hardcode hex/rgb values.

```tsx
// ✅ Correct
<div className="bg-boteco-primary text-boteco-primary-foreground">

// ❌ Wrong
<div className="bg-[#9b1d5a]">
```

### 4. Component Imports (shadcn/ui + React Bits)
- **shadcn/ui**: Pre-installed in `src/components/ui/`. Do NOT reinstall. Import as `@/components/ui/button`
- **React Bits**: Custom registry components in `src/components/reactbits/`. Use for marketing sections (Hero, FeatureGrid, Stepper, etc.)

```tsx
// Marketing pages pattern (see src/pages/MenuDigital.tsx)
import Hero from '@/components/reactbits/Hero';
import FeatureGrid from '@/components/reactbits/FeatureGrid';
```

### 5. Layout & Navigation
- `src/components/Layout.tsx`: Wraps all pages with Header + Footer
- `src/components/Header.tsx`: Dynamically renders nav from `src/content/common/navigation.json`
- Navigation supports `type: 'link' | 'mega'` for dropdown menus
- `resolveHref()` handles locale-aware URL building

### 6. Optional Features via Environment
**Clerk Auth**: Conditionally rendered based on `hasClerkAuth` from `src/utils/clerk.ts`:
```tsx
import { hasClerkAuth } from '@/utils/clerk';

{hasClerkAuth && <SignedIn><UserButton /></SignedIn>}
```

### 7. Data Persistence Strategy (src/lib/storage/)
Hybrid approach for development:
- **Dev mode**: Writes to localStorage (immediate persistence)
- **Production**: Reads from `/public/data/*.json` (static hosting)

See `src/lib/storage/contactRequests.ts` for the dual-storage pattern with localStorage caching.

## Development Workflows

### Adding a New Page
1. Create route in `src/App.tsx` under `/:locale` wrapper
2. Create page component in `src/pages/NomeDaPagina.tsx`
3. Add content JSON files: `src/content/{pt,en,es,fr}/nome-da-pagina.json`
4. Update `src/i18n.ts` to import new translations
5. Add navigation entry to `src/content/common/navigation.json`

### Running & Testing
```powershell
pnpm dev              # Dev server on localhost:8080
pnpm build            # Production build
pnpm build:dev        # Development build (for debugging)
pnpm test             # Node.js test runner (see tests/*.test.mjs)
pnpm lint             # ESLint with TypeScript
```

### Testing Philosophy
Tests live in `tests/*.test.mjs` (Node.js native test runner, not Jest). Focus on:
- Content structure validation (JSON schemas)
- Theme configuration correctness
- Critical data flows (contact requests)

See `tests/theme.test.mjs` for assertion patterns using regex matching.

## Common Pitfalls

1. **Layout shifts during sidebar toggle**: Current issue documented in `UI_UX_CORRECTION_PLAN.md`. Avoid translate-based animations; use width transitions.

2. **Skeleton loaders jumping**: Always provide explicit width/height on skeleton components. Don't rely on parent container.

3. **Breaking locale routing**: Test all navigation links after changes. URLs without `/:locale` prefix will 404.

4. **Theme transitions flashing**: `ThemeProvider` uses `disableTransitionOnChange={true}` to prevent flash. Don't override.

5. **Clerk auth in dev**: App gracefully degrades without `VITE_CLERK_PUBLISHABLE_KEY`. Never assume auth is present.

## Utility Functions

**`cn()` (src/lib/utils.ts)**: Merge Tailwind classes with conflict resolution
```tsx
className={cn("base-classes", conditional && "extra-class", props.className)}
```

**`resolveHref()` (Header.tsx)**: Build locale-aware URLs from navigation items
```tsx
resolveHref({ href: "/sobre", localeAware: true }) // → "/pt/sobre"
```

## Key Files Reference
- **Routing**: `src/App.tsx`
- **i18n Setup**: `src/i18n.ts`
- **Theme Config**: `src/globals.css` (CSS vars), `tailwind.config.ts`
- **Component Registry**: `components.json` (includes @react-bits registry)
- **Navigation**: `src/content/common/navigation.json`
- **Type Definitions**: `src/types/navigation.ts`, `src/types/marketing-page.ts`

## Design System Principles
- **Spacing**: Use Tailwind spacing scale (4px base). Common: `gap-4`, `p-6`, `mt-8`
- **Typography**: Body text should be `text-boteco-neutral` or `text-foreground`
- **Responsive**: Mobile-first with `useIsMobile()` hook for JS-based decisions
- **Accessibility**: All interactive elements need `focus-visible:ring-2` for keyboard nav
- **Transitions**: Always include `transition-colors duration-300` on theme-aware elements

---

**Maintained by**: AI conventions sourced from `AI_RULES.md` (legacy) and `UI_UX_CORRECTION_PLAN.md` (active)  
**Last Updated**: 2025-11-01 (Dark theme implementation branch)
