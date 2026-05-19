import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // --- Step 1: Remove specific Ottomans ---
    const ottomansToRemove = ["The Apex Ottoman", "The Elm Ottoman"];
    const ottomansResult = await prisma.product.deleteMany({
        where: {
            category: 'Ottomans',
            name: { in: ottomansToRemove }
        }
    });
    console.log(`Ottomans deleted: ${ottomansResult.count} (expected 2)`);

    // --- Step 2: Remove all Tables EXCEPT "Elegant Wooden Dining Table" ---
    const tablesResult = await prisma.product.deleteMany({
        where: {
            category: 'Tables',
            name: { not: 'Elegant Wooden Dining Table' }
        }
    });
    console.log(`Tables deleted: ${tablesResult.count} (expected 7)`);

    // --- Verify ---
    const remainingOttomans = await prisma.product.findMany({
        where: { category: 'Ottomans' },
        select: { id: true, name: true }
    });
    const remainingTables = await prisma.product.findMany({
        where: { category: 'Tables' },
        select: { id: true, name: true }
    });

    console.log('\nRemaining Ottomans:', remainingOttomans.map(p => p.name));
    console.log('Remaining Tables:', remainingTables.map(p => p.name));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
