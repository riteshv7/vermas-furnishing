# Design: Rename Product from "1" to "Elegant Wooden Dining Table"

The user wants to rename a product that was accidentally named "1" during import.

## Proposed Solution
Create a script to update the product name in the database using Prisma.

## Steps
1. Create `scripts/rename_product.js`.
2. Find product where `name` is "1".
3. Update `name` to "Elegant Wooden Dining Table".
4. Run script.
