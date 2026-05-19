// scripts/reclassify-sofa-products.mjs
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Delete any existing Sofa products with IDs 1-9 (if they exist)
  await prisma.product.deleteMany({
    where: {
      id: { in: [1,2,3,4,5,6,7,8,9] },
      category: "Sofas",
    },
  });

  // Insert the re‑classified products
  const newProducts = [
    { id: 1, name: "The Velvet Luxe Ottoman", category: "Ottomans", description: "A refined Ottoman upholstered in plush velvet with elegant brass accents.", image: "/products/placeholder-1.jpg" },
    { id: 2, name: "The Brass‑Trimmed Ottoman", category: "Ottomans", description: "An Ottoman featuring a sleek brass‑finished frame and rich leather upholstery.", image: "/products/placeholder-2.jpg" },
    { id: 3, name: "The Marble‑Edge Coffee Table", category: "Tables", description: "A coffee table with a pristine marble top and polished metal legs.", image: "/products/placeholder-3.jpg" },
    { id: 4, name: "The Oak‑Frame Console Table", category: "Tables", description: "A sleek console table crafted from solid oak with a natural finish.", image: "/products/placeholder-4.jpg" },
    { id: 5, name: "The Glass‑Top Accent Table", category: "Tables", description: "A minimalist accent table with a clear tempered glass top and chrome legs.", image: "/products/placeholder-5.jpg" },
    { id: 6, name: "The Industrial Steel Side Table", category: "Tables", description: "A sturdy side table built from dark steel with a reclaimed wood top.", image: "/products/placeholder-6.jpg" },
    { id: 7, name: "The Curved Walnut Dining Table", category: "Tables", description: "An elegant dining table featuring a curved walnut top and tapered legs.", image: "/products/placeholder-7.jpg" },
    { id: 8, name: "The Mid‑Century Modern End Table", category: "Tables", description: "A classic mid‑century end table with tapered legs and a walnut veneer.", image: "/products/placeholder-8.jpg" },
    { id: 9, name: "The Rustic Reclaimed Wood Table", category: "Tables", description: "A rustic table made from reclaimed wood with a distressed finish.", image: "/products/placeholder-9.jpg" },
  ];

  for (const prod of newProducts) {
    await prisma.product.create({ data: prod });
  }

  console.log("Reclassification complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
