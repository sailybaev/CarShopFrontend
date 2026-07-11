# CarShop Design System — Tesla.com Inspired

## Design Philosophy

CarShop is a premium automotive marketplace. The visual language borrows from Tesla.com: full-bleed imagery, confident typography, generous negative space, and a near-monochrome palette. The interface should feel minimal, expensive, and product-first. Every page is treated like a showroom — the car is the hero.

## Colors

### Primary Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--background` | `#ffffff` | `#171717` | Page background |
| `--foreground` | `#171717` | `#f5f5f5` | Primary text |
| `--primary` | `#171717` | `#f5f5f5` | Buttons, headings, key actions |
| `--primary-foreground` | `#f5f5f5` | `#171717` | Text on primary surfaces |
| `--secondary` | `#f5f5f5` | `#262626` | Section backgrounds, cards |
| `--secondary-foreground` | `#171717` | `#f5f5f5` | Text on secondary surfaces |
| `--muted` | `#f5f5f5` | `#262626` | Subtle fills |
| `--muted-foreground` | `#737373` | `#a3a3a3` | Captions, labels, metadata |
| `--border` | `#e5e5e5` | `rgba(255,255,255,0.1)` | Dividers, input borders |
| `--ring` | `#737373` | `#737373` | Focus rings |
| `--destructive` | `#dc2626` | `#ef4444` | Errors, delete actions |
| `--accent` | `#e5e5e5` | `#404040` | Hover states, highlights |

### Tesla-Inspired Additions

| Token | Value | Usage |
|-------|-------|-------|
| `--tesla-red` | `#e82127` | Signature accent for CTAs, featured badges, live indicators |
| `--tesla-black` | `#000000` | Full-bleed hero overlays, footer |
| `--tesla-white` | `#ffffff` | Hero text, light cards |
| `--tesla-gray` | `#393c41` | Secondary text on dark backgrounds |
| `--tesla-silver` | `#f4f4f4` | Alternating section backgrounds |

## Typography

### Font Stack

- **Headings / UI:** `Geist Sans`, system-ui, sans-serif
- **Body:** `Geist Sans` or `DM Sans`
- **Monospace accents:** `JetBrains Mono`, `Geist Mono` — used sparingly for prices, VINs, spec labels

### Type Scale

| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Display | `clamp(2.5rem, 6vw, 5rem)` | 700 | 1.05 | -0.02em | Hero headline |
| H1 | `clamp(2rem, 4vw, 3.5rem)` | 700 | 1.1 | -0.02em | Page titles |
| H2 | `clamp(1.5rem, 3vw, 2.5rem)` | 600 | 1.15 | -0.01em | Section titles |
| H3 | `1.25rem` | 600 | 1.3 | 0 | Card titles |
| Body | `1rem` | 400 | 1.6 | 0 | Paragraphs |
| Caption | `0.75rem` | 500 | 1.4 | 0.05em | Labels, uppercase metadata |
| Button | `0.75rem` | 600 | 1 | 0.08em | Uppercase CTA text |
| Price | `1.5rem` | 700 | 1.2 | -0.01em | Car prices |

## Spacing

### Base Scale

Use a `4px` base grid: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.

### Section Spacing

| Context | Value |
|---------|-------|
| Section padding Y | `py-20 md:py-32` (80–128px) |
| Section padding X | `px-6 md:px-12 lg:px-20` |
| Container max-width | `max-w-7xl` (1280px) centered |
| Hero min-height | `min-h-screen` |
| Card grid gap | `gap-6 md:gap-10` |
| Component internal gap | `gap-4 md:gap-6` |

## Buttons

### Variants

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | `--primary` | `--primary-foreground` | none | Main CTAs: "Book a Test Drive", "Inquire" |
| Secondary | `--secondary` | `--secondary-foreground` | none | Secondary actions on light sections |
| Outline | transparent | `--foreground` | `--border` | "View Details", ghost actions |
| Ghost | transparent | current | none | Navigation links, dark hero overlays |
| Destructive | `--destructive/10` | `--destructive` | none | Delete listing |

### Shape & Size

- **Border radius:** `rounded-none` (Tesla-style sharp, architectural buttons)
- **Height:** `h-12 md:h-14`
- **Padding:** `px-8 md:px-10`
- **Text:** uppercase, `font-semibold`, `tracking-widest`

### Interactions

- Hover: `opacity-90` or subtle background shift
- Active: `translate-y-px`
- Focus: `ring-2 ring-ring ring-offset-2`
- Transition: `transition-all duration-200`

## Layout

### Page Structure

1. **Sticky Header** — minimal logo, nav links, cart, theme toggle, login
2. **Full-Bleed Hero** — video/image background with overlay, centered or left-aligned text, stacked CTAs
3. **Content Sections** — alternating `--background` and `--secondary` bands
4. **Footer** — dark primary background, 4-column link grid

### Grid

- Inventory cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Detail page: `grid-cols-1 lg:grid-cols-5` (gallery 3 cols, sticky sidebar 2 cols)
- Specs grid: `grid-cols-2`

## Cards

### Inventory Card

```
┌─────────────────────────────┐
│  [Image 4:3 with gradient]  │
│  FEATURED badge (optional)  │
│  Year bottom-right          │
├─────────────────────────────┤
│  BRAND (uppercase muted)    │
│  Model Name                 │
│  Mileage · Transmission ·   │
│  Fuel Type                  │
├─────────────────────────────┤
│  $45,000          [Buy] [♡] │
└─────────────────────────────┘
```

- Border: `border border-border`
- No top border on text block; image sits flush
- Image hover: `scale-105` over `700ms`
- Card hover: subtle shadow lift

### Spec Cards (Detail Page)

- Background: `--secondary`
- Border: `1px solid --border`
- Icon + uppercase label + value
- Sharp corners, generous padding

## Animations

### Entrance Animations

Use `motion` (Framer Motion) for scroll-triggered reveals:

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Hero text | `opacity: 0 → 1`, `y: 40 → 0` | 0.8s | `ease-out` |
| Section headings | `opacity: 0 → 1`, `y: 30 → 0` | 0.6s | `ease-out` |
| Cards | staggered `opacity: 0 → 1`, `y: 40 → 0` | 0.5s each, 0.15s stagger | `ease-out` |

### Hover Effects

- Card images: `scale-105` over `700ms`
- Buttons: `opacity-90` or background shift over `200ms`
- Links: `color` transition over `150ms`

### Micro-interactions

- Cart drawer: slide in from right with backdrop fade
- Mobile menu: accordion slide down
- Toast / badge: subtle scale pop

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | Single-column layouts; hamburger menu; full-width buttons stacked; reduced section padding |
| Tablet (640–1024px) | 2-column grids; side-by-side buttons; persistent nav |
| Desktop (>1024px) | 3-column inventory grids; 5-column detail page; sticky sidebar |

### Hero Responsive

- Text aligns left on desktop, center on mobile
- CTAs stack vertically on mobile, side-by-side on desktop
- Video remains full-bleed with `object-cover`

## UI Principles

1. **Product-first.** The vehicle image always dominates. Text supports, never competes.
2. **Restraint.** Use only black, white, grays, and the signature red accent. Avoid decorative colors.
3. **Sharp geometry.** Prefer `rounded-none` or very small radii. Automotive design is precise.
4. **Generous space.** Let sections breathe. Avoid cramped layouts.
5. **Clear hierarchy.** Large headlines → small uppercase labels → body text.
6. **Consistency.** Reuse the same button style, spacing rhythm, and card pattern everywhere.
7. **Motion with purpose.** Animate only to guide attention or confirm interaction.
8. **Dark mode readiness.** All tokens must flip cleanly between light and dark themes.
9. **Accessibility.** Minimum contrast ratio 4.5:1 for text. Focus rings visible on all interactive elements.
10. **Showroom feel.** Every screen should evoke walking through a premium dealership — clean, confident, expensive.
