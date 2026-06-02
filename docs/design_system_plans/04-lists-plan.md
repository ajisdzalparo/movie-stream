# Plan 4: Lists Component

## 1. Context and Goals
**Design Intent:** Present grouped information or sequential steps clearly and scannably.
**Goals:** Standardize 66 list instances into ordered, unordered, and descriptive variants.

## 2. Design Tokens and Foundations
- Spacing: `space.2` between items, `space.4` between list and surrounding content.
- Typography: `font.size.base`, `color.text.primary`.
- Markers: Custom bullets or numbers using `color.surface.strong` or `color.text.inverse`.

## 3. Component-level Rules
- **Anatomy:** List container (`ul`/`ol`/`dl`), List items (`li`/`dt`/`dd`), Markers.
- **Variants:** Unordered (bullets, icons), Ordered (numbers), Description list.
- **States:** Default (mostly static), Hover (if items are interactive).
- **Responsive Behavior:** Padding adjusts based on viewport width.
- **Handling Long Content:** Text wraps, marker remains top-aligned.

## 4. Accessibility Requirements
- **Target:** WCAG 2.2 AA.
- Must use semantic HTML (`ul`, `ol`, `li`) so screen readers announce item count.
- Contrast constraints apply to list item text and custom markers.

## 5. Content and Tone Standards
- Parallel structure for list items (e.g., all start with verbs or all are nouns).
- Concise formatting.

## 6. Anti-patterns
- Do not use `div` or `span` elements to simulate lists visually.
- Do not introduce one-off spacing exceptions between list items.

## 7. QA Checklist
- [ ] Semantic HTML is used.
- [ ] Spacing between items uses `space.*` tokens.
- [ ] Text wraps correctly without breaking marker alignment.
