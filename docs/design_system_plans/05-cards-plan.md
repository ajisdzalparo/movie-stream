# Plan 5: Cards Component

## 1. Context and Goals
**Design Intent:** Group related content and actions into easily digestible, self-contained interactive surfaces.
**Goals:** Consolidate 14 card instances into a consistent layout system.

## 2. Design Tokens and Foundations
- Background: `color.surface.raised` or `color.surface.base`.
- Border: `color.border.default`.
- Radius: `radius.md` or `radius.lg`.
- Spacing: Inner padding typically `space.6` or `space.8`.
- Motion: `motion.duration.fast` for hover effects.

## 3. Component-level Rules
- **Anatomy:** Container, Header (Title, Subtitle), Media (Image/Icon), Body (Text), Footer (Actions/Buttons).
- **Variants:** Static, Interactive (entire card is clickable), Actionable (card contains buttons).
- **States:** Default, Hover (elevation or border change), Focus-visible, Disabled.
- **Responsive Behavior:** Stacks vertically on mobile; grid/flex layout on desktop.
- **Handling Overflow:** Text truncation for titles; description wraps up to N lines. Empty states defined.

## 4. Accessibility Requirements
- **Target:** WCAG 2.2 AA.
- Interactive cards must be keyboard navigable.
- If the whole card is a link, ensure redundant links inside are avoided or properly hidden from screen readers.
- Focus-visible ring must wrap the entire card if it's the primary interactive element.

## 5. Content and Tone Standards
- Titles are concise.
- Descriptions provide clear context.
- Footer actions are unambiguous.

## 6. Anti-patterns
- Do not nest interactive elements (e.g., button inside a fully clickable card) without explicit keyboard/DOM handling.
- Do not use raw hex colors for borders or shadows.

## 7. QA Checklist
- [ ] Padding uses correct spacing tokens.
- [ ] Hover and focus states are visible and use system motion tokens.
- [ ] Contrast ratios for text inside the card meet WCAG AA.
