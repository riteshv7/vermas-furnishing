import { PrismaClient } from '@prisma/client';
import { products } from '../data/products.js';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting migration...');
    
    // Clear existing products first to avoid duplicates
    await prisma.product.deleteMany({});
    console.log('Cleared existing products.');

    for (const product of products) {
        await prisma.product.create({
            data: {
                id: product.id,
                name: product.name,
                category: product.category,
                description: product.description,
                image: product.image,
                images: product.images ? JSON.stringify(product.images) : null,
                features: product.features ? JSON.stringify(product.features) : null,
            }
        });
        console.log(`Migrated: ${product.name}`);
    }
    
    console.log('Migration complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
