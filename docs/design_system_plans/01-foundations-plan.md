# Plan 1: Design Tokens and Foundations

## 1. Context and Goals

**Design Intent:** Establish the core visual language and design tokens for Zapier's marketing site to ensure consistency, accessibility, and fast delivery.
**Goals:** Define reusable typography, color, spacing, radius, and motion tokens that will be consumed by all UI components.

## 2. Design Tokens and Foundations

- **Typography:**
  - `font.family.primary`: Inter
  - `font.family.stack`: Inter, Inter Fallback, system-ui, ui-sans-serif, sans-serif
  - `font.size.base`: 14px, `font.weight.base`: 400, `font.lineHeight.base`: 24px
  - Scale: xs=12px, sm=14px, md=16px, lg=18px, xl=20px, 2xl=24px, 3xl=28px, 4xl=32px
- **Colors:**
  - `color.text.primary`: #201515
  - `color.text.tertiary`: #eceae3
  - `color.text.inverse`: #605d52
  - `color.border.default`: #36342e
  - `color.surface.base`: #000000
  - `color.surface.raised`: #fffefb
  - `color.surface.strong`: #ff4f00
- **Spacing:**
  - 1=4px, 2=6px, 3=8px, 4=10px, 5=12px, 6=16px, 7=20px, 8=24px
- **Radius:** xs=4px, sm=5px, md=14px, lg=18px
- **Motion:** `motion.duration.instant`: 200ms, `motion.duration.fast`: 250ms

## 3. Component-level Rules

These tokens dictate the state and responsive behavior of all components across the system.

- All components must map their dimensional properties directly to the spacing and radius scales.
- All typography must map to the font family and scale tokens.

## 4. Accessibility Requirements

- **Target:** WCAG 2.2 AA.
- Tokens must provide sufficient contrast combinations (e.g., `text.primary` on `surface.raised`).
- Focus rings must use a tokenized color with high contrast.

## 5. Content and Tone Standards

- Concise, confident, implementation-focused token naming.

## 6. Anti-patterns

- Do not use raw hex values; use semantic tokens.
- Do not introduce one-off spacing or typography exceptions.

## 7. QA Checklist

- [ ] All tokens defined in the global CSS/Theme provider.
- [ ] Contrast ratios checked for standard text-background pairings.
- [ ] No raw hex values or hardcoded pixels in the codebase.
