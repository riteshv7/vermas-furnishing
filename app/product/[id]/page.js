import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDisplay from '@/components/ProductDisplay';
import { products as localProducts } from '@/data/products';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const productId = parseInt(id);
    
    let product = null;
    try {
        product = await prisma.product.findUnique({
            where: { id: productId }
        });
    } catch (error) {
        console.error("Product metadata DB fetch error:", error);
    }

    if (!product) {
        product = localProducts.find(p => p.id === productId);
    }

    if (!product) {
        return {
            title: 'Product Not Found | Verma\'s Furnishing',
        };
    }

    // --- Automated SEO Logic ---
    const seoTitle = `${product.name} | Premium ${product.category} Furniture | Verma's Mumbai`;
    const baseDesc = product.description.length > 150 
        ? `${product.description.substring(0, 157)}...` 
        : product.description;
    const seoDescription = `${baseDesc} Discover handcrafted luxury ${product.category.toLowerCase()} at Verma's Furnishing. Premium quality, bespoke designs. Inquire now.`;
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
            images: [{ url: product.image, width: 1200, height: 630, alt: product.name }],
            locale: 'en_IN',
            type: 'website',
        },
    };
}

export default async function ProductPage({ params }) {
    const { id } = await params;
    const productId = parseInt(id);

    let dbProduct = null;
    try {
        dbProduct = await prisma.product.findUnique({
            where: { id: productId }
        });
    } catch (error) {
        console.error("Product page DB fetch error:", error);
    }

    if (!dbProduct) {
        dbProduct = localProducts.find(p => p.id === productId);
    }

    if (!dbProduct) {
        redirect('/catalog');
    }

    // Format product (Safely parse images if string, else keep as is)
    const product = {
        ...dbProduct,
        images: typeof dbProduct.images === 'string' ? JSON.parse(dbProduct.images) : (dbProduct.images || [dbProduct.image]),
        features: typeof dbProduct.features === 'string' ? JSON.parse(dbProduct.features) : (dbProduct.features || [])
    };

    // Find related products
    let dbRelated = [];
    try {
        dbRelated = await prisma.product.findMany({
            where: { 
                category: product.category,
                id: { not: productId }
            },
            take: 10
        });
    } catch (error) {
        console.error("Related products DB fetch error:", error);
        dbRelated = localProducts.filter(p => p.category === product.category && p.id !== productId).slice(0, 10);
    }

    const relatedProducts = dbRelated
        .map(p => ({
            ...p,
            images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || [p.image]),
            features: typeof p.features === 'string' ? JSON.parse(p.features) : (p.features || [])
        }))
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image,
        description: product.description,
        category: product.category,
        brand: { '@type': 'Brand', name: "Verma's Furnishing" },
        offers: {
            '@type': 'Offer',
            url: `https://vermasfurnishing.com/product/${product.id}`,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: "Verma's Furnishing" }
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
