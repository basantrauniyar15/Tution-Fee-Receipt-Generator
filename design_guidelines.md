# Design Guidelines: Tuition Fee PDF Generator

## Design Approach
**System:** Linear-inspired professional productivity tool with Notion's information hierarchy
**Rationale:** Clean, focused interface optimized for form completion and data management without visual clutter

## Typography
- **Primary Font:** Inter (Google Fonts)
- **Hierarchy:**
  - H1: 2.5rem/3rem (mobile/desktop), font-weight 700
  - H2: 1.75rem/2rem, font-weight 600
  - Body: 1rem, font-weight 400, line-height 1.6
  - Labels: 0.875rem, font-weight 500, uppercase tracking-wide
  - Input text: 1rem, font-weight 400

## Layout System
**Spacing Primitives:** Tailwind units 3, 4, 6, 8, 12, 16
- Mobile base padding: p-6
- Desktop sections: py-16 px-8
- Form fields: gap-6 (mobile), gap-8 (desktop)
- Component spacing: mb-8 standard, mb-12 between major sections

**Container Strategy:**
- Max-width: 1200px for application
- Form container: max-w-2xl centered
- Two-column form layout on desktop (>768px)

## Hero Section
**Layout:** Full-width gradient overlay on image (h-[70vh])
- Background: Professional workspace/calculator imagery with 40% dark overlay
- Content: Centered, max-w-3xl
- Heading + subtitle + primary CTA with backdrop-blur-lg bg-white/10 for button
- Mobile: Stack vertically, h-[60vh]

## Component Library

### Forms
**Input Fields:**
- Height: h-12 (mobile), h-14 (desktop)
- Border: 2px solid with focus ring
- Padding: px-4
- Label above input, mb-2
- Error states: red border + message below

**Structure:**
- Student Information section
- Fee Details section (grid of inputs)
- Additional Charges (dynamic add/remove)
- Payment Information
- Notes/Remarks textarea

### Buttons
- Primary: h-12 px-8, rounded-lg, font-medium
- Secondary: outlined variant
- Icon buttons: h-10 w-10, rounded-full

### Cards
- PDF Preview card: shadow-lg, rounded-xl, p-6
- Recent generations list: border, rounded-lg, p-4 each

### Navigation
- Top bar: h-16, sticky, border-bottom
- Logo + "Generate PDF" CTA + user menu
- Mobile: hamburger menu

## Key Sections (Post-Hero)

1. **Quick Generate Form** (immediate below hero)
   - Two-column grid on desktop
   - White card with shadow-xl
   - Real-time preview panel (desktop only)

2. **Features Grid** (3 columns desktop, 1 mobile)
   - Icons + heading + description
   - Features: Instant generation, Custom branding, Multiple formats, Auto-calculations

3. **Recent Documents**
   - List view with thumbnail + metadata
   - Quick actions (download, duplicate, delete)

4. **Footer**
   - Contact info, quick links, copyright
   - py-12, border-top

## Mobile Optimization
- Single column forms
- Larger touch targets (min 44px)
- Bottom sheet for PDF preview
- Generous vertical spacing (gap-6 minimum)
- No viewport height constraints on content sections

## Images
**Hero Image:** Professional desk with calculator, documents, laptop - suggesting financial organization and professionalism. Warm, well-lit workspace. Position: background-cover with center positioning.

**Feature Icons:** Use Heroicons (outline style) via CDN

## Animation
Minimal: Smooth form validation feedback, subtle page transitions only