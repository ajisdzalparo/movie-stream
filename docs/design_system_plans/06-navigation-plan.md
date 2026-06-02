# Plan 6: Navigation Component

## 1. Context and Goals
**Design Intent:** Provide intuitive, consistent, and accessible wayfinding across the marketing site.
**Goals:** Standardize 13 navigation instances (headers, footers, sidebars).

## 2. Design Tokens and Foundations
- Backgrounds: `color.surface.base` or `color.surface.raised`.
- Typography: `font.size.base` for top-level, `font.size.sm` for secondary.
- Spacing: `space.4` to `space.6` between nav items.

## 3. Component-level Rules
- **Anatomy:** Nav container, Nav items (Links), Dropdown menus, Brand logo, Action buttons.
- **Variants:** Top Navbar, Footer Nav, Mobile Drawer/Menu.
- **States:** Default, Hover, Focus-visible, Active (Current Page).
- **Responsive Behavior:** 
  - Desktop: Horizontal list.
  - Mobile: Collapses into a hamburger menu or drawer.
- **Interactions:**
  - Pointer: Hover opens dropdowns (with intent delay).
  - Keyboard: Tab cycles through items. Space/Enter opens submenus. Escape closes them.

## 4. Accessibility Requirements
- **Target:** WCAG 2.2 AA.
- Semantic `<nav>` landmark used.
- Current page indicated visually and semantically (`aria-current="page"`).
- Dropdowns must trap focus or manage focus predictably.
- Focus-visible rules required for all links and buttons within navigation.

## 5. Content and Tone Standards
- Use short, descriptive labels (e.g., "Features", "Pricing").
- Consistent casing (Title Case).

## 6. Anti-patterns
- Do not hide focus indicators.
- Do not rely solely on hover to open menus (must be clickable/keyboard accessible).
- Do not use low-contrast text for inactive links.

## 7. QA Checklist
- [ ] Keyboard navigation functions correctly through all levels of the menu.
- [ ] Screen readers announce dropdown states (expanded/collapsed).
- [ ] Active state is clearly styled using tokens.
