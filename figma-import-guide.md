# Expert Recruitments - Figma Import Guide

## How to Import These Wireframes into Figma

### Step 1: Import SVG Files
1. Open Figma and create a new file
2. Go to **File** → **Import** 
3. Select the following SVG files:
   - `figma-import-wireframes.svg` (Desktop layouts)
   - `mobile-wireframes.svg` (Mobile layouts)
4. Drag and drop them onto your Figma canvas

### Step 2: Create Figma Frames
After importing, create proper Figma frames with these exact dimensions:

#### Desktop Frames (1400px width)
- **Homepage:** 1400 × 800px
- **Job Board:** 1400 × 800px  
- **Job Details:** 1400 × 800px
- **User Dashboard:** 1400 × 800px
- **Admin Panel:** 1400 × 800px

#### Mobile Frames (375px width)
- **Homepage:** 375 × 812px
- **Job Board:** 375 × 812px
- **Job Details:** 375 × 812px

#### Tablet Frames (768px width)  
- **Homepage:** 768 × 1024px
- **Job Board:** 768 × 1024px

### Step 3: Convert SVG Elements to Native Figma
1. Select imported SVG elements
2. Right-click → **Flatten** (converts to vector shapes)
3. Use **Outline stroke** to convert borders
4. Group related elements together

### Step 4: Apply Design System

#### Colors (Create as Figma Styles)
```
Primary Blue: #5372f1
Secondary Blue: #4f46e5  
Content Gray: #64748b
Sidebar Gray: #9ca3af
Success Green: #22c55e
Warning Red: #ef4444
Form Purple: #a855f7
Background: #f8fafc
White: #ffffff
```

#### Typography (Create as Text Styles)
```
Font Family: Inter (Google Fonts)

Headers:
- H1: 32px, Semi-Bold (600)
- H2: 24px, Semi-Bold (600)  
- H3: 20px, Semi-Bold (600)
- H4: 18px, Semi-Bold (600)

Body:
- Body Large: 16px, Regular (400)
- Body: 14px, Regular (400)
- Body Small: 12px, Regular (400)
- Caption: 10px, Regular (400)
```

#### Spacing System (Grid)
```
Base Unit: 8px
Layout Grid: 12 columns, 20px gutters
Margins: 20px (mobile), 40px (tablet), 60px (desktop)

Spacing Values:
- xs: 4px
- sm: 8px  
- md: 12px
- lg: 16px
- xl: 20px
- xxl: 24px
- xxxl: 32px
```

#### Component Dimensions

**Desktop Elements:**
- Header: 1400 × 80px
- Hero Section: 1400 × 400px
- Search Bar: 600 × 60px
- Job Cards: 530 × 120px
- Sidebar: 280px width
- Buttons: 150 × 50px (primary), 120 × 40px (secondary)

**Mobile Elements:**
- Header: 375 × 60px
- Hero Section: 375 × 250px  
- Search Bar: 335 × 50px
- Job Cards: 335 × 100px
- Buttons: 335 × 45px (full width), 150 × 45px (inline)

### Step 5: Create Components
1. Select wireframe elements
2. Create components for reusable elements:
   - Header/Navigation
   - Job Cards
   - Search Bars
   - Buttons
   - Form Fields
   - Stat Cards

### Step 6: Build Interactive Prototype
1. Connect frames with prototyping arrows
2. Add interactions:
   - Button clicks → Page transitions
   - Form submissions → Success states
   - Navigation → Different pages
   - Hover states for desktop
   - Touch states for mobile

### Step 7: Responsive Design
Create variants for each component:
- Desktop (1400px)
- Tablet (768px)  
- Mobile (375px)

Use Auto Layout for flexible components that adapt to content.

## Exact Measurements Reference

### Homepage Layout
```
Header: 0,0 → 1400×80px
Hero: 0,80 → 1400×400px
Search: 100,280 → 600×60px
CTA Button 1: 100,360 → 150×50px
CTA Button 2: 270,360 → 150×50px
Stats Section: 0,550 → 1400×120px
Job Cards: 50,690 → 300×120px (4 cards, 20px gap)
```

### Job Board Layout
```
Header: 0,0 → 1400×80px
Filter Sidebar: 0,80 → 280×420px
Search Bar: 300,80 → 1100×60px
Job Cards Grid: 300,160 → 530×120px (2 columns, 20px gap)
Pagination: 600,490 → 200×40px
```

### Mobile Homepage  
```
Header: 0,0 → 375×60px
Hero: 0,60 → 375×250px
Search: 20,200 → 335×50px
CTA: 20,270 → 335×45px
Stats: 10,340 → 110×80px (3 cards, 10px gap)
Featured Jobs: 20,440 → 335×80px (stacked, 20px gap)
```

## Professional Tips

1. **Use Auto Layout** for flexible components
2. **Create a Design System** with consistent colors, typography, and spacing
3. **Build Component Variants** for different states (default, hover, active, disabled)
4. **Add Constraints** to make responsive designs that scale properly
5. **Use Figma Variables** for consistent spacing and colors across all frames
6. **Create Interactive Prototypes** to demonstrate user flows
7. **Add Micro-interactions** with Smart Animate for professional polish

## File Organization
```
📁 Expert Recruitments Design System
├── 🎨 Design Tokens (Colors, Typography, Spacing)
├── 🧩 Components (Headers, Cards, Buttons, Forms)
├── 📱 Mobile Screens (375px frames)
├── 💻 Desktop Screens (1400px frames)
├── 🔄 User Flows (Interactive prototypes)
└── 📖 Documentation (This guide)
```

This approach gives you pixel-perfect wireframes that match your website's exact requirements while being fully native to Figma for easy editing and collaboration.