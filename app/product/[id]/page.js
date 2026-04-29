import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDisplay from '@/components/ProductDisplay';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const productId = parseInt(id);
    
    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product) {
        return {
            title: 'Product Not Found - Vermas Furnishing',
        };
    }

    return {
        title: `${product.name} - Vermas Furnishing`,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: [
                {
                    url: product.image,
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
            ],
        },
    };
}

export default async function ProductPage({ params }) {
    const { id } = await params;
    const productId = parseInt(id);

    const dbProduct = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!dbProduct) {
        redirect('/catalog');
    }

    // Format product
    const product = {
        ...dbProduct,
        images: dbProduct.images ? JSON.parse(dbProduct.images) : undefined,
        features: dbProduct.features ? JSON.parse(dbProduct.features) : []
    };

    // Find related products
    const dbRelated = await prisma.product.findMany({
        where: { 
            category: product.category,
            id: { not: productId }
        },
        take: 10 // Get a bunch to shuffle
    });

    const relatedProducts = dbRelated
        .map(p => ({
            ...p,
            features: p.features ? JSON.parse(p.features) : []
        }))
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, 4);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image,
        description: product.description,
        brand: {
            '@type': 'Brand',
            name: "Verma's Furnishing"
        },
        offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock'
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDisplay product={product} relatedProducts={relatedProducts} />
        </>
    );
}
