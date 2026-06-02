# Plan 3: Links Component

## 1. Context and Goals
**Design Intent:** Guide users intuitively through the Zapier platform and marketing pages.
**Goals:** Unify 511 link instances to ensure predictable navigation and clear states.

## 2. Design Tokens and Foundations
- Color: `color.surface.strong` or `color.text.primary` with underline.
- Typography: Inherits from parent or uses `font.size.base`.
- Focus ring: Uses `color.surface.strong`.

## 3. Component-level Rules
- **Anatomy:** Text string, optional trailing icon (e.g., external link indicator).
- **Variants:** Inline, Standalone, Navigation.
- **States:** Default, Hover (underline or color shift), Focus-visible, Active, Visited.
- **Responsive Behavior:** Wraps with text naturally.
- **Interactions:**
  - Pointer: Cursor changes to pointer.
  - Keyboard: Triggers on Enter.
  - Touch: Adequate line-height to ensure touch accessibility.

## 4. Accessibility Requirements
- **Target:** WCAG 2.2 AA.
- Links must be distinguishable from surrounding text (underline preferred).
- Focus-visible state must not be hidden.
- Accessible names (aria-label) required if the text itself is not descriptive.

## 5. Content and Tone Standards
- Descriptive, confident text.
- Example: "Read the API documentation" instead of "Read more".

## 6. Anti-patterns
- Do not use raw hex colors for hover states.
- Do not remove underlines unless in a clear navigation context.
- Do not use links for actions that change state (use Buttons).

## 7. QA Checklist
- [ ] Hover state is distinct.
- [ ] Focus-visible ring is prominent.
- [ ] Screen readers announce the link destination clearly.
