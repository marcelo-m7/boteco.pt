# UI/UX Correction Plan - Boteco.pt

**Status:** Draft  
**Created:** November 1, 2025  
**Repository:** marcelo-m7/boteco.pt  
**Current Branch:** `2025-11-01/implement-dark-theme-across-application`

---

## Executive Summary

This plan addresses visual inconsistencies and layout issues in the Boteco.pt React/TypeScript application. Through systematic analysis, we've identified **4 critical areas** requiring correction:

1. **Sidebar mechanics** (translate/rotate issues → width-based toggling)
2. **Loading state stability** (skeleton width jumps → fixed dimensions)
3. **Layout alignment** (items-center causing stretching → items-stretch)
4. **Grid/card consistency** (varying column counts, unequal heights, border compensation)

**Target Outcomes:**
- Zero layout shifts during sidebar toggle
- Stable skeleton loaders (no width jumps)
- Aligned grids across all breakpoints
- Lighthouse Accessibility score ≥ 90
- Standardized spacing scale application

---

## Current Issues Identified

### 1. Sidebar Implementation Problems

**File:** `src/components/ui/sidebar.tsx` (lines 230-260)

**Issues:**
```tsx
// Current problematic implementation:
className={cn(
  "group-data-[side=right]:rotate-180",  // ❌ Causes visual rotation artifacts
  side === "left"
    ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"  // ❌ Translate-based hiding
    : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
)}
```

**Symptoms:**
- Layout jumps when toggling sidebar (translate causes reflow)
- Right-side rotation creates visual artifacts
- Transitions are janky (200ms isn't synced with translate)

**Root Cause:** Using `translate` and `rotate` instead of width-based collapsing with `flex-row-reverse` for right positioning.

---

### 2. Loading State Instability

**File:** `src/components/ui/skeleton.tsx`

**Issues:**
```tsx
// Current implementation:
<div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
```

**Problems:**
- No default width/height → relies on parent (causes jumps)
- `SidebarMenuSkeleton` uses CSS variables for width (`--skeleton-width`) but inconsistent application
- `animate-pulse` is Tailwind's default (no customization for theme transitions)

**Symptoms:**
- Skeleton loaders "jump" between widths during loading
- Inconsistent pulse timing in dark mode

---

### 3. Home Page Alignment Issues

**File:** `src/pages/Home.tsx` (line 38)

**Current:**
```tsx
<div className="flex flex-col items-center justify-center">
  <HeroSection />
  <FeaturesSection />
  {/* ... */}
</div>
```

**Issue:** `items-center` forces all children to center-align, causing:
- Full-width sections to artificially constrain
- Inconsistent horizontal alignment across sections
- Breaks when sections have different max-widths

**Fix Required:** Replace `items-center` with `items-stretch` and let sections self-contain with proper max-width + mx-auto patterns.

---

### 4. Grid & Card Layout Inconsistencies

**Files Affected:**
- `src/components/reactbits/FeatureGrid.tsx`
- `src/components/reactbits/PricingTable.tsx`
- `src/components/home/SolutionsSection.tsx`
- `src/pages/Blog.tsx`
- `src/pages/About.tsx`

**Issues:**

| Component | Current Columns | Border/Shadow Compensation | Equal Heights |
|-----------|----------------|---------------------------|---------------|
| FeatureGrid | `md:grid-cols-2 lg:grid-cols-3` | ❌ No | ✅ Yes (h-full) |
| PricingTable | `md:grid-cols-2` | ❌ No | ✅ Yes (h-full) |
| SolutionsSection | `md:grid-cols-2 xl:grid-cols-3` | ❌ No | ✅ Yes (h-full) |
| Blog | `md:grid-cols-2 lg:grid-cols-3` | ❌ No | ⚠️ Partial |
| About (values) | `md:grid-cols-3` | ❌ No | ✅ Yes (h-full) |

**Problems:**
1. **Inconsistent breakpoint naming:** Some use `xl:`, others skip straight to `lg:`
2. **No border/shadow compensation:** Cards with borders/shadows create visual misalignment
3. **Gap inconsistency:** Mix of `gap-6`, `gap-8`, `gap-4` without systematic scale

---

### 5. Spacing Token Inconsistencies

**Current State (from grep analysis):**

| Token Pattern | Usage Count | Issue |
|---------------|-------------|-------|
| `gap-16` | High | Too large, no intermediate steps |
| `gap-8` | Medium | Good baseline |
| `gap-6` | High | Most common, but overlaps with gap-8 |
| `gap-4` | Low | Underutilized |
| `gap-3`, `gap-2` | Scattered | No clear hierarchy |
| `space-y-*` | Inconsistent | Mixes with `gap-*` causing confusion |

**Tailwind Config:** Uses default spacing scale (no custom tokens defined in `tailwind.config.ts`)

**Recommended Scale:**
```
Small:    gap-2 (0.5rem / 8px)  → Inline elements (icons + text)
Medium:   gap-4 (1rem / 16px)   → Related groups (form fields, list items)
Large:    gap-6 (1.5rem / 24px) → Grid items, card layouts
XLarge:   gap-8 (2rem / 32px)   → Section spacing
XXLarge:  gap-12 (3rem / 48px)  → Major section dividers
```

---

## Proposed Solution: 4 Themed PRs

### **PR #1: Sidebar Refactor (Infrastructure)**
**Branch:** `fix/sidebar-width-based-toggle`  
**Priority:** High (blocks responsive work)

#### Changes:
1. **Remove problematic patterns:**
   ```tsx
   // DELETE:
   "group-data-[side=right]:rotate-180"
   "left-[calc(var(--sidebar-width)*-1)]"
   ```

2. **Implement width-based toggle:**
   ```tsx
   // NEW approach:
   className={cn(
     "transition-[width] duration-200 ease-linear",
     state === "expanded" ? "w-[--sidebar-width]" : "w-0",
     "overflow-hidden"  // Prevent content overflow during collapse
   )}
   ```

3. **Right-side positioning via flex-row-reverse:**
   ```tsx
   // Parent container:
   <div className={cn(
     "flex",
     side === "right" && "flex-row-reverse"  // ✅ No rotation needed
   )}>
     <Sidebar />
     <SidebarInset />
   </div>
   ```

#### Testing:
- [ ] Toggle sidebar 20x rapidly (no jank)
- [ ] Check both left/right sides
- [ ] Verify no layout shifts in DevTools (Layout Shift metric)
- [ ] Test keyboard shortcut (Cmd/Ctrl+B)

#### Before/After:
- **Before:** 3-5 layout shifts during toggle, 200ms janky transition
- **After:** 0 layout shifts, smooth 200ms width transition

---

### **PR #2: Loading States & Skeletons**
**Branch:** `fix/stable-skeleton-loaders`  
**Priority:** Medium

#### Changes:
1. **Add default dimensions to Skeleton:**
   ```tsx
   // src/components/ui/skeleton.tsx
   function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
     return (
       <div
         className={cn(
           "animate-pulse rounded-md bg-muted",
           "h-4 w-full",  // ✅ Default dimensions
           className
         )}
         {...props}
       />
     );
   }
   ```

2. **Create Skeleton variants:**
   ```tsx
   // New file: src/components/ui/skeleton-variants.tsx
   export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
     <div className="space-y-2">
       {Array.from({ length: lines }).map((_, i) => (
         <Skeleton key={i} className="h-4 w-full last:w-4/5" />
       ))}
     </div>
   );

   export const SkeletonCard = () => (
     <Card className="p-6 space-y-4">
       <Skeleton className="h-6 w-2/3" />  {/* Title */}
       <SkeletonText lines={2} />
       <Skeleton className="h-10 w-32" />  {/* Button */}
     </Card>
   );
   ```

3. **Fix SidebarMenuSkeleton widths:**
   ```tsx
   // src/components/ui/sidebar.tsx (line 677)
   <Skeleton
     className="h-4 w-32"  // ✅ Fixed width instead of max-w-[--skeleton-width]
     data-sidebar="menu-skeleton-text"
   />
   ```

#### Testing:
- [ ] Fast 3G throttle: no width jumps during load
- [ ] Dark mode: pulse animation visibility
- [ ] Sidebar: skeleton widths stable during collapse

---

### **PR #3: Layout Alignment & Spacing**
**Branch:** `fix/layout-spacing-consistency`  
**Priority:** High (visual quality)

#### Changes:

**3.1 Home Page Wrapper:**
```tsx
// src/pages/Home.tsx
<div className="flex flex-col items-stretch">  {/* ✅ Changed from items-center */}
  <HeroSection />
  <FeaturesSection />
  {/* ... */}
</div>
```

**3.2 Standardize Grid Patterns:**
```tsx
// Apply to ALL grid components:
// - FeatureGrid
// - PricingTable
// - SolutionsSection
// - Blog
// - About

// Consistent pattern:
<div className={cn(
  "grid gap-6",  // ✅ Standardize on gap-6 for card grids
  "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",  // ✅ Consistent breakpoints
  "auto-rows-fr"  // ✅ Equal row heights
)}>
  {items.map(item => (
    <div className="flex">  {/* ✅ Flex container for h-full to work */}
      <Card className="flex-1 h-full" />
    </div>
  ))}
</div>
```

**3.3 Border/Shadow Compensation:**
```tsx
// For cards with borders/shadows:
<Card className={cn(
  "transition-all duration-300",
  "hover:-translate-y-1 hover:shadow-xl",
  "mb-1"  // ✅ Compensate for shadow to prevent grid misalignment
)} />
```

**3.4 Spacing Scale Application:**

Create a spacing guidelines doc and apply systematically:

```tsx
// Component-internal spacing:
<CardHeader className="space-y-3">  {/* ✅ Consistent vertical rhythm */}
<CardContent className="space-y-4">

// Grid/layout spacing:
<div className="grid gap-6">  {/* ✅ Card grids */}
<section className="space-y-8">  {/* ✅ Section internal */}
<main className="space-y-12">  {/* ✅ Between sections */}
```

#### Testing:
- [ ] Visual regression at 4 breakpoints (mobile, tablet, desktop, XL)
- [ ] Grid alignment check: all cards start/end at same vertical positions
- [ ] Measure spacing with DevTools: verify gap-6 = 24px consistently

---

### **PR #4: Accessibility & Responsive Fixes**
**Branch:** `fix/a11y-responsive-improvements`  
**Priority:** Medium (quality gate)

#### Changes:

**4.1 Accessibility Fixes:**

1. **Focus indicators:**
   ```tsx
   // Add to all interactive elements missing focus states:
   className={cn(
     "focus-visible:outline-none",
     "focus-visible:ring-2 focus-visible:ring-boteco-primary",
     "focus-visible:ring-offset-2 focus-visible:ring-offset-background"
   )}
   ```

2. **ARIA labels for icon-only buttons:**
   ```tsx
   // Example: ThemeToggle, LanguageSwitcher, UserButton
   <Button aria-label="Toggle theme" />
   <Button aria-label="Switch language" />
   ```

3. **Heading hierarchy audit:**
   - Ensure H1 → H2 → H3 order (no skips)
   - One H1 per page (currently in `<Hero>` title)

4. **Color contrast:**
   ```tsx
   // Check all text-boteco-neutral/80 combinations:
   // Minimum WCAG AA: 4.5:1 for normal text, 3:1 for large text
   
   // Fix in globals.css if needed:
   .dark {
     --boteco-neutral: 42.4 70.8% 92%;  // Current
     // If contrast fails, increase lightness to 94-96%
   }
   ```

**4.2 Responsive Fixes:**

1. **Container max-width consistency:**
   ```tsx
   // Apply to all full-width sections:
   <section className="w-full">
     <div className="container mx-auto max-w-7xl px-4">  {/* ✅ Consistent pattern */}
       {/* content */}
     </div>
   </section>
   ```

2. **Mobile navigation improvements:**
   ```tsx
   // src/components/MobileNav.tsx
   // Ensure touch targets ≥ 44px × 44px (WCAG 2.5.5)
   <Button className="min-h-[44px] min-w-[44px]" />
   ```

3. **Breakpoint audit:**
   - `sm`: 640px (unused, consider removing)
   - `md`: 768px → Navigation switch, 2-col grids
   - `lg`: 1024px → 3-col grids
   - `xl`: 1280px → Wider grids (e.g., Solutions)
   - `2xl`: 1400px → Container max (from tailwind.config.ts)

#### Testing:
- [ ] Run Lighthouse CI (target: Accessibility ≥ 90)
- [ ] Keyboard navigation: Tab through entire app (no traps)
- [ ] Screen reader test (NVDA/VoiceOver): logical reading order
- [ ] Touch target sizes: ≥ 44px on mobile
- [ ] Color contrast: all text passes WCAG AA

---

## Visual Regression Testing Setup

**Goal:** Automate before/after screenshot comparisons

### Recommended Tool: Playwright with Percy or Chromatic

**Setup Steps:**

1. **Install Playwright:**
   ```powershell
   pnpm add -D @playwright/test
   pnpm exec playwright install
   ```

2. **Create test config:**
   ```typescript
   // playwright.config.ts
   import { defineConfig, devices } from '@playwright/test';

   export default defineConfig({
     testDir: './tests/visual',
     use: {
       baseURL: 'http://localhost:8080',
       screenshot: 'only-on-failure',
     },
     projects: [
       { name: 'chrome', use: { ...devices['Desktop Chrome'] } },
       { name: 'mobile', use: { ...devices['iPhone 13'] } },
     ],
   });
   ```

3. **Create visual tests:**
   ```typescript
   // tests/visual/homepage.spec.ts
   import { test, expect } from '@playwright/test';

   test.describe('Home Page Visual Regression', () => {
     test('desktop layout', async ({ page }) => {
       await page.goto('/pt');
       await page.waitForLoadState('networkidle');
       
       // Capture full page
       await expect(page).toHaveScreenshot('home-desktop.png', {
         fullPage: true,
       });
     });

     test('sidebar toggle animation', async ({ page }) => {
       await page.goto('/pt/painel');
       
       // Before toggle
       await expect(page).toHaveScreenshot('sidebar-expanded.png');
       
       // Trigger toggle
       await page.click('[data-sidebar="trigger"]');
       await page.waitForTimeout(250);  // Wait for 200ms animation + buffer
       
       // After toggle
       await expect(page).toHaveScreenshot('sidebar-collapsed.png');
     });

     test('grid alignment at breakpoints', async ({ page }) => {
       const breakpoints = [
         { width: 375, height: 667, name: 'mobile' },
         { width: 768, height: 1024, name: 'tablet' },
         { width: 1440, height: 900, name: 'desktop' },
       ];

       for (const bp of breakpoints) {
         await page.setViewportSize({ width: bp.width, height: bp.height });
         await page.goto('/pt');
         await page.locator('[data-testid="features-grid"]').scrollIntoViewIfNeeded();
         
         await expect(page.locator('[data-testid="features-grid"]'))
           .toHaveScreenshot(`grid-${bp.name}.png`);
       }
     });
   });
   ```

4. **Add data-testid attributes:**
   ```tsx
   // src/components/reactbits/FeatureGrid.tsx
   <div
     data-testid="features-grid"
     className={cn('grid gap-8 text-left', columnClasses[columns])}
   >
   ```

5. **Run tests:**
   ```powershell
   pnpm exec playwright test --update-snapshots  # Initial baseline
   pnpm exec playwright test  # Subsequent runs (compare)
   ```

---

## Acceptance Criteria / Definition of Done

### PR #1: Sidebar Refactor
- [ ] Sidebar toggles with 0 layout shifts (verified in DevTools Performance panel)
- [ ] Right-side sidebar uses `flex-row-reverse` (no `rotate-180`)
- [ ] Transition is smooth 200ms (no jank at 60fps)
- [ ] Keyboard shortcut works (Cmd/Ctrl+B)
- [ ] Mobile sheet overlay still functions

### PR #2: Loading States
- [ ] All `<Skeleton>` components have explicit width/height
- [ ] No width jumps during loading (throttled 3G test)
- [ ] `animate-pulse` timing consistent in light/dark mode
- [ ] Created 3+ skeleton variants (text, card, list)

### PR #3: Layout & Spacing
- [ ] Home page uses `items-stretch` (not `items-center`)
- [ ] All card grids use consistent breakpoints (`md:grid-cols-2 lg:grid-cols-3`)
- [ ] Grid items have equal heights (`auto-rows-fr` + `h-full`)
- [ ] Spacing scale applied consistently (gap-6 for grids, gap-8 for sections)
- [ ] Border/shadow compensation in place (no visual misalignment)

### PR #4: Accessibility & Responsive
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] All interactive elements have focus indicators
- [ ] Heading hierarchy correct (H1 → H2 → H3, no skips)
- [ ] Color contrast passes WCAG AA (4.5:1 minimum)
- [ ] Touch targets ≥ 44px × 44px on mobile
- [ ] Keyboard navigation: no traps, logical tab order

### Overall Quality Gates
- [ ] Visual regression tests pass (Playwright screenshots match)
- [ ] No console errors or warnings
- [ ] Build succeeds (`pnpm build`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Existing tests pass (`pnpm test`)
- [ ] PR descriptions include before/after screenshots
- [ ] Lighthouse reports attached to PRs

---

## Timeline & Effort Estimates

| PR | Tasks | Estimated Effort | Dependencies |
|----|-------|------------------|--------------|
| **PR #1** | Sidebar refactor | 4-6 hours | None |
| **PR #2** | Loading states | 3-4 hours | None |
| **PR #3** | Layout & spacing | 6-8 hours | PR #1 (sidebar context) |
| **PR #4** | A11y & responsive | 6-8 hours | PR #3 (layout stable) |
| **Visual Tests** | Playwright setup | 4-5 hours | All PRs (baseline) |
| **Total** | - | **23-31 hours** | Sequential execution |

**Recommended Execution Order:**
1. **Week 1:** PR #1 + PR #2 (parallel, no dependencies)
2. **Week 2:** PR #3 (requires stable sidebar for layout testing)
3. **Week 3:** PR #4 + Visual Tests (final polish + automation)

---

## Before/After Success Metrics

| Metric | Before (Current) | After (Target) |
|--------|------------------|----------------|
| **Layout Shifts (Sidebar)** | 3-5 shifts | 0 shifts |
| **Lighthouse Accessibility** | ~78-82 | ≥ 90 |
| **Grid Alignment Issues** | ~8-10 misalignments | 0 misalignments |
| **Spacing Inconsistencies** | 15+ different patterns | 5 standardized tokens |
| **Skeleton Width Jumps** | 100% of loaders | 0% (all stable) |
| **Focus Indicator Coverage** | ~60% | 100% |
| **WCAG AA Contrast Passes** | ~85% | 100% |

---

## Rollout Plan

### Phase 1: Infrastructure (PR #1-2)
- **Goal:** Fix foundational mechanics (sidebar, skeletons)
- **Risk:** Low (isolated components)
- **Testing:** Unit + manual toggle/load testing

### Phase 2: Visual Consistency (PR #3)
- **Goal:** Align layouts, standardize spacing
- **Risk:** Medium (touches many files)
- **Testing:** Visual regression at 4 breakpoints

### Phase 3: Quality Gates (PR #4)
- **Goal:** Meet accessibility and responsive standards
- **Risk:** Low (mostly additions, no removal)
- **Testing:** Lighthouse CI + keyboard/screen reader

### Phase 4: Automation
- **Goal:** Prevent regressions with Playwright tests
- **Risk:** Low (test infrastructure)
- **Testing:** CI integration (GitHub Actions)

---

## Open Questions / Feedback Needed

1. **Sidebar Design:**
   - Current toggle behavior is `offcanvas` (slide out). Should we also support `icon` mode (collapse to icons)?
   - Right-side sidebar: Is this used in production, or can we defer testing?

2. **Spacing Scale:**
   - Proposed scale uses Tailwind defaults. Do we need custom tokens (e.g., `gap-boteco-sm`)?
   - Should we create a spacing utilities file (`spacing.ts`) to centralize?

3. **Visual Regression Budget:**
   - Playwright vs. Percy vs. Chromatic? (Percy/Chromatic have better diffing but cost $)
   - How many breakpoints to test? (Proposed: mobile, tablet, desktop, XL)

4. **A11y Priorities:**
   - Should we aim for WCAG AAA (7:1 contrast) or stick with AA (4.5:1)?
   - Any specific screen reader testing requirements beyond NVDA/VoiceOver?

5. **Timeline Flexibility:**
   - Can we split PR #3 into 2 smaller PRs (Layout + Spacing separately)?
   - Any hard deadlines for Lighthouse A11y ≥ 90?

---

## Appendix: Key Files Reference

### Components to Modify
- `src/components/ui/sidebar.tsx` (PR #1)
- `src/components/ui/skeleton.tsx` (PR #2)
- `src/pages/Home.tsx` (PR #3)
- `src/components/reactbits/FeatureGrid.tsx` (PR #3)
- `src/components/reactbits/PricingTable.tsx` (PR #3)
- `src/components/home/SolutionsSection.tsx` (PR #3)
- `src/pages/Blog.tsx` (PR #3)
- `src/pages/About.tsx` (PR #3)
- `src/components/Header.tsx` (PR #4)
- `src/components/MobileNav.tsx` (PR #4)

### Config Files
- `tailwind.config.ts` (spacing scale documentation)
- `src/globals.css` (color contrast fixes)
- `playwright.config.ts` (new, for visual tests)

### Documentation
- `.github/copilot-instructions.md` (update with spacing guidelines)
- `README.md` (add visual regression testing docs)

---

**Next Steps:**
1. Review this plan with team
2. Address open questions
3. Create GitHub issues for each PR
4. Assign PRs to sprint(s)
5. Set up Playwright CI (can be done in parallel with PR work)

---

_End of UI/UX Correction Plan_
