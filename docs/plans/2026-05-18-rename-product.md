# Rename Product Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Rename product from "1" to "Elegant Wooden Dining Table".

**Architecture:** Create a temporary script to update the name via Prisma.

**Tech Stack:** Node.js, Prisma.

---

### Task 1: Create and Run Rename Script

**Files:**
- Create: `scripts/rename_product.js`

**Step 1: Write the script**

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const result = await prisma.product.updateMany({
        where: { name: '1' },
        data: { name: 'Elegant Wooden Dining Table' }
    });
    console.log(`Updated ${result.count} products.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
```

**Step 2: Run the script**

Run: `node scripts/rename_product.js`
Expected: Output should say "Updated N products."

**Step 3: Commit**

```bash
git add scripts/rename_product.js
git commit -m "feat: add rename product script"
```

### Task 2: Cleanup Script

**Files:**
- Delete: `scripts/rename_product.js`

**Step 1: Delete the file**

**Step 2: Commit**

```bash
git rm scripts/rename_product.js
git commit -m "chore: remove rename product script"
```
