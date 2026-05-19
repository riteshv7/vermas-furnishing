const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const chelsea = await prisma.product.findFirst({ where: { name: 'The Chelsea Sofa' } });
  
  if (chelsea) {
    let images = JSON.parse(chelsea.images);
    if (images.length >= 3) {
      images.splice(2, 1); // Remove the 3rd image (index 2)
      
      await prisma.product.update({
        where: { id: chelsea.id },
        data: {
          images: JSON.stringify(images)
        }
      });
      console.log("Successfully removed the 3rd image from The Chelsea Sofa!");
    } else {
      console.log(`The Chelsea Sofa only has ${images.length} images.`);
    }
  } else {
    console.log("The Chelsea Sofa not found.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
