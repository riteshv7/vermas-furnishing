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
            title: 'Product Not Found | Verma\'s Furnishing',
        };
    }

    // --- Automated SEO Logic ---
    // 1. Create a high-converting Title Tag
    const seoTitle = `${product.name} | Premium ${product.category} Furniture | Verma's Mumbai`;
    
    // 2. Create a punchy Meta Description
    const baseDesc = product.description.length > 150 
        ? `${product.description.substring(0, 157)}...` 
        : product.description;
    const seoDescription = `${baseDesc} Discover handcrafted luxury ${product.category.toLowerCase()} at Verma's Furnishing. Premium quality, bespoke designs. Inquire now.`;

    // 3. Generate dynamic keywords
    const keywords = `${product.name}, ${product.category}, luxury furniture mumbai, bespoke furniture, handcrafted furniture india, ${product.category} designs, home decor mumbai`;

    return {
        title: seoTitle,
        description: seoDescription,
        keywords: keywords,
        openGraph: {
            title: `${product.name} | Verma's Furnishing`,
            description: seoDescription,
            url: `https://vermasfurnishing.com/product/${product.id}`,
            siteName: "Verma's Furnishing",
            images: [
                {
                    url: product.image,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
            locale: 'en_IN',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: seoTitle,
            description: seoDescription,
            images: [product.image],
        },
        alternates: {
            canonical: `https://vermasfurnishing.com/product/${product.id}`,
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
        take: 10
    });

    const relatedProducts = dbRelated
        .map(p => ({
            ...p,
            features: p.features ? JSON.parse(p.features) : []
        }))
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

    // Enhanced Schema.org JSON-LD for Google Rich Results
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image,
        description: product.description,
        category: product.category,
        brand: {
            '@type': 'Brand',
            name: "Verma's Furnishing"
        },
        offers: {
            '@type': 'Offer',
            url: `https://vermasfurnishing.com/product/${product.id}`,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: "Verma's Furnishing"
            }
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
