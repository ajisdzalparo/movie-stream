# Plan 2: Buttons Component

## 1. Context and Goals
**Design Intent:** Provide clear, accessible, and highly visible interactive elements for user actions across the Zapier marketing site.
**Goals:** Standardize the 146 button instances into consistent variants using defined design tokens.

## 2. Design Tokens and Foundations
- Uses `font.family.primary`, `font.size.base`.
- Backgrounds use `color.surface.strong` for primary, `color.surface.raised` for secondary.
- Border uses `color.border.default`.
- Spacing uses `space.4` to `space.6` for padding.
- Border radius uses `radius.xs` or `radius.sm`.
- Transitions use `motion.duration.instant`.

## 3. Component-level Rules
- **Anatomy:** Container, Label (optional Icon left/right).
- **Variants:** Primary, Secondary, Ghost.
- **States:** Default, Hover, Focus-visible, Active, Disabled, Loading, Error.
- **Responsive Behavior:** Full width on small screens, inline-block on larger screens.
- **Interactions:**
  - Pointer: Cursor changes to pointer.
  - Keyboard: Triggers on Enter or Space.
  - Touch: Minimum tap target size of 44x44px.

## 4. Accessibility Requirements
- **Target:** WCAG 2.2 AA.
- Must have focus-visible styling (e.g., solid outline, 2px offset).
- Must have minimum contrast ratio of 4.5:1 for text on button background.
- Disabled state must be perceivable but excluded from tab sequence.

## 5. Content and Tone Standards
- Button labels must be concise, confident, and action-oriented (e.g., "Get Started", not "Click here to get started").

## 6. Anti-patterns
- Do not use ambiguous labels (e.g., "Click Here").
- Do not hide focus indicators.
- Do not use buttons for navigation (use Links instead).

## 7. QA Checklist
- [ ] Keyboard navigation (Tab) sets focus.
- [ ] Enter/Space activates the button.
- [ ] Hover and Active states use system tokens.
- [ ] Contrast meets WCAG AA.
