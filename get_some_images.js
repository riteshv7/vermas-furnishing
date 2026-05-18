const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const latestSofa = await prisma.product.findFirst({
    where: { category: 'Sofas' },
    orderBy: { id: 'desc' }
  });
  
  const latestChair = await prisma.product.findFirst({
    where: { category: 'Chairs' },
    orderBy: { id: 'desc' }
  });

  console.log("Latest Sofa Image:", latestSofa.image);
  console.log("Latest Chair Image:", latestChair.image);
}

main().catch(console.error).finally(() => prisma.$disconnect());
