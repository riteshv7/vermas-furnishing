# Clear Headboards Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Clear all "Headboards" category products from both the Supabase/Prisma database and the local `data/products.js` file while keeping the `"Headboards"` category filter intact.

**Architecture:** Use a clean Prisma script to execute the database deletion, and manually remove the headboards list from `data/products.js`.

**Tech Stack:** Next.js, Prisma, Node.js

---

### Task 1: Clear DB Headboards

**Files:**
- Create: `scripts/clear-db-headboards.mjs`

**Step 1: Write the minimal implementation to clear the headboards in the DB**

```javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Clearing Headboards from database...');
    const result = await prisma.product.deleteMany({
        where: {
            category: 'Headboards'
        }
    });
    console.log(`Successfully deleted ${result.count} headboards.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
```

**Step 2: Run the script to delete headboard products from DB**

Run: `node scripts/clear-db-headboards.mjs`
Expected: "Successfully deleted 24 headboards."

**Step 3: Run verification to check count is now 0**

Run: `node check-headboards.mjs`
Expected: Number of Headboard products in DB: 0

**Step 4: Commit**

```bash
git add scripts/clear-db-headboards.mjs
git commit -m "db: clear headboards category from Supabase database"
```

---

### Task 2: Clear Local File Headboards

**Files:**
- Modify: `data/products.js`

**Step 1: Edit `data/products.js` to remove products with IDs 401–424 (Headboards category)**

We will remove all elements in `products` where `category: "Headboards"` while keeping `"Headboards"` inside `categories` export.

**Step 2: Verify the file compiles and works by running check-headboards.mjs on it**

Run: `node -e "import('./data/products.js').then(m => console.log('Remaining products:', m.products.length, 'Headboards in file:', m.products.filter(p => p.category === 'Headboards').length))"`
Expected: Remaining products: 122 (was 146), Headboards in file: 0.

**Step 3: Commit**

```bash
git add data/products.js
git commit -m "data: remove headboard products from static file fallback"
```
