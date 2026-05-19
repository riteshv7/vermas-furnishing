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
