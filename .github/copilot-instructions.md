# Boteco.pt AI Coding Instructions

## Architecture Overview

**Boteco.pt** is a multilingual (pt/en/es/fr) React SPA for restaurant management built with:
- **Vite + React 18 + TypeScript** with SWC compilation (port 8080)
- **React Router v6** with locale-aware routing: `/:locale/path` wraps all public pages
- **i18next** for internationalization - namespace = filename in `src/content/{locale}/`
- **shadcn/ui** (Radix + Tailwind) + **React Bits** for pre-built marketing components
- **next-themes** for dark/light mode with custom Boteco brand HSL colors
- **Optional Clerk auth** (feature-flagged via `VITE_CLERK_PUBLISHABLE_KEY` env var)
- **TanStack Query** with localStorage fallback for data persistence
- **Node.js native test runner** (not Jest) + Playwright visual regression tests

## Critical Patterns

### 1. Routing Architecture (`src/App.tsx`)
**Rule**: All new pages MUST go under `/:locale` wrapper except `/painel` (auth-protected).

```tsx
<Route path="/:locale" element={<LocaleWrapper />}>
  <Route path="nova-pagina" element={<NovaPagina />} />
</Route>
```

**LocaleWrapper** (`src/components/LocaleWrapper.tsx`) syncs URL locale with i18n and wraps with `<Layout>`.  
Root `/` auto-redirects to `/pt`. URLs like `/about` will 404 - must be `/pt/sobre`.

### 2. i18n Content Structure (`src/content/` + `src/i18n.ts`)
**Zero hardcoded strings.** All text lives in JSON organized by locale and page:
- `src/content/{pt,en,es,fr}/{page}.json` - Page translations (namespace = filename)
- `src/content/common/navigation.json` - Multi-locale nav labels with nested mega menu support

**Adding a new page checklist**:
1. Create `src/content/pt/nova-pagina.json` (+ en/es/fr copies)
2. Import in `src/i18n.ts` resources object: `import ptNovaPagina from './content/pt/nova-pagina.json'`
3. Add namespace to `ns` array and `resources.pt['nova-pagina']` mapping
4. In component: `const { t } = useTranslation('nova-pagina');` then `t('hero.title')`

**Navigation entries** in `navigation.json` support `type: 'link' | 'mega'` (dropdown with descriptions).

### 3. Theme System (Boteco Custom Brand Colors)
Uses **dual theming** with CSS variables in `src/globals.css`:
- **Boteco brand colors**: `boteco-primary`, `boteco-secondary`, `boteco-tertiary`, `boteco-neutral` (+ `-foreground` pairs)
- **shadcn semantic tokens**: `background`, `foreground`, `primary`, `card`, etc. (mapped to Boteco colors)
- **Dark mode**: `:root` vs `.dark` classes swap HSL values. All colors are CSS vars - **never hardcode hex/rgb**.

```tsx
// ✅ Correct - uses theme variables
<div className="bg-boteco-primary text-boteco-primary-foreground">

// ❌ Wrong - hardcoded color breaks dark mode
<div style={{ backgroundColor: '#9b1d5a' }}>
```

**ThemeProvider** uses `disableTransitionOnChange={true}` to prevent flash - don't override.

### 4. Component Architecture & Imports
**Pre-installed - DO NOT reinstall**:
- **shadcn/ui**: `src/components/ui/` - Import as `@/components/ui/button`. Never edit these files.
- **React Bits**: `src/components/reactbits/` - Marketing sections (Hero, FeatureGrid, Stepper, etc.)

**Marketing page pattern** (`src/pages/MenuDigital.tsx` example):
```tsx
import MarketingPageTemplate from '@/components/templates/MarketingPageTemplate';

const MenuDigital = () => <MarketingPageTemplate translationNamespace="menu-digital" />;
```

**MarketingPageTemplate** auto-renders Hero → Benefits → Workflow → Highlights → CTA from i18n JSON structure.

### 5. Data Persistence Strategy (`src/lib/storage/`)
Hybrid approach for dev/prod environments:
- **Dev mode**: Writes to localStorage (immediate persistence)
- **Production**: Reads from `/public/data/*.json` (static hosting)

**Example** (`src/lib/storage/contactRequests.ts`):
```typescript
// Tries remote fetch, falls back to localStorage cache
export const getContactRequests = async (): Promise<ContactRequest[]> => {
  try {
    const remote = await fetchRemoteRequests();
    writeToLocalStorage(remote);
    return remote;
  } catch (error) {
    return readFromLocalStorage();
  }
};
```

**Pattern**: Functions named `get*`, `create*`, `calculate*Metrics` with full TypeScript interfaces.

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
