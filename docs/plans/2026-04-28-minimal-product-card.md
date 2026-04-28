# Minimalist Product Card Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Transform the product card into a clean, editorial layout with no prices and minimal info.

**Architecture:** Modifying the CSS and JS for the ProductCard component to remove borders, shadows, descriptions, and feature tags. Adding subtle hover animations.

**Tech Stack:** React, Next.js, Framer Motion, CSS Modules.

---

### Task 1: Refactor ProductCard.module.css

**Files:**
- Modify: `components/ProductCard.module.css`

**Step 1: Remove card borders, shadows, and background**
- Update `.card` to remove `background-color`, `border`, and `border-radius`.
- Update `.card:hover` to remove `box-shadow` and `border-color`.

**Step 2: Update image wrapper and animations**
- Ensure `.imageWrapper` has a consistent aspect ratio.
- Add subtle scale animation to `.image` on hover.

**Step 3: Restyle content and typography**
- Update `.name` to use `var(--font-cormorant)` (Serif).
- Update `.category` to be a muted subtitle below the name.
- Remove styles for `.description`, `.features`, and `.feature`.

**Step 4: Restyle Inquiry Button**
- Update `.inquireBtn` to be a floating pill or clean text link that appears on hover over the image.

---

### Task 2: Refactor ProductCard.js

**Files:**
- Modify: `components/ProductCard.js`

**Step 1: Simplify Component Logic**
- Remove logic related to `product.description` and `product.features`.
- Remove price logic (if any).

**Step 2: Update JSX Structure**
- Update the title and category layout.
- Ensure `Cormorant Garamond` is applied to the title.
- Clean up the `content` div.

**Step 3: Update Animations**
- Refine Framer Motion transitions for the "Inquire" button reveal.

---

### Task 3: Verification on Localhost

**Step 1: Start development server**
- Run: `npm run dev`

**Step 2: Manual Verification**
- Open `http://localhost:3000/catalog` in browser.
- Verify:
    - No borders or shadows on product cards.
    - Product name is in Serif font.
    - Category is a small gray subtitle.
    - No description or feature tags.
    - Hovering reveals the WhatsApp button and zooms the image.

**Step 3: Final confirmation**
- Verify responsiveness on mobile screen sizes.

---
**Note:** NO GIT COMMITS per user request. Changes are for local verification only.
