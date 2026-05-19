# Design Doc: Clearing Headboards Catalog

## Goal
To clear all existing "Headboards" category products from both the Supabase/Prisma database and the static `data/products.js` file, while maintaining the "Headboards" category filter option itself. This allows the user to upload new, fresh headboard products.

## Scope of Changes
1. **Database**: Run a node script to perform a database delete operation for products with category 'Headboards'.
2. **Local File (`data/products.js`)**: Modify the static file to remove all products under the "Headboards" category (IDs 401–424).
3. **Category Option**: Keep `"Headboards"` inside the `categories` array in `data/products.js`.

## Verification Plan
1. Run a script to verify database product counts in the 'Headboards' category is 0.
2. Check `data/products.js` to ensure the Headboards products are removed, and the `categories` array is intact.
