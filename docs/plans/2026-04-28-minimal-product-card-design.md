# Minimalist Editorial Product Card Design

## Summary
Transform the existing product catalog cards into a high-end, editorial gallery-style layout. The design focuses on stunning photography and clean typography, removing clutter such as descriptions, feature tags, and borders.

## Design Details

### 1. Visual Layout
- **Style**: "Gallery" aesthetic.
- **Borders/Shadows**: Remove all card borders, box-shadows, and background colors.
- **Aspect Ratio**: maintain a consistent, high-end aspect ratio for images.
- **Typography**:
    - **Product Title**: Use `Cormorant Garamond` (Serif) for a sophisticated look.
    - **Subtitle (Category)**: Use `Inter` or `Plus Jakarta Sans` in a small, muted gray font below the title.
- **Spacing**: Increase white space between image and text to feel "breathing" and editorial.

### 2. Information Architecture
- **Removed Elements**:
    - Product Description.
    - Feature Tags (pills).
    - Price (since prices are not yet available).
- **Retained Elements**:
    - Image (Primary + Hover alternate).
    - Product Name.
    - Category (as subtitle).
    - Wishlist (subtle).
    - WhatsApp Inquiry (moved to hover-only).

### 3. Interactivity
- **Image Hover**: Subtle scale-up animation (e.g., `scale(1.05)`).
- **Inquiry Reveal**: The WhatsApp "Inquire" button will fade/slide in over the image on hover.
- **Wishlist**: The heart icon will remain but with a more minimal, less distracting style.

## Technical Implementation
- **Component**: `components/ProductCard.js`
- **Styles**: `components/ProductCard.module.css`
- **Framework**: Next.js (App Router), Framer Motion for animations.

## Success Criteria
- The catalog grid looks like a high-end lookbook.
- Mobile experience remains fluid with swipeable image galleries.
- WhatsApp inquiry remains easily accessible on hover or click.
