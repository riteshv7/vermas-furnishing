import { categories } from '@/data/products';
import { prisma } from '@/lib/prisma';
import CatalogClient from './CatalogClient';

export async function generateMetadata({ searchParams }) {
    const resolvedParams = await searchParams;
    const category = resolvedParams?.category;
    
    if (category && category !== 'All') {
        return {
            title: `Premium ${category} Collection | Handcrafted Luxury Furniture | Verma's`,
            description: `Explore our bespoke ${category.toLowerCase()} collection. Handcrafted in Mumbai with premium materials. Custom designs available for your home.`,
            openGraph: {
                title: `${category} Collection | Verma's Furnishing`,
                description: `Browse our curated catalog of handcrafted ${category.toLowerCase()}.`,
                type: 'website',
            },
        };
    }

    return {
        title: "Our Collection | Handcrafted Sofas, Dining & Headboards | Verma's Furnishing",
        description: "Browse our curated catalog of handcrafted sofas, marble dining sets, tufted headboards, accent chairs and bespoke furniture. Made in Mumbai, delivered across India.",
        openGraph: {
            title: "Our Collection | Verma's Furnishing",
            description: "Browse our curated catalog of handcrafted sofas, marble dining sets, tufted headboards, accent chairs and bespoke furniture.",
            type: 'website',
        },
    };
}

// JSON-LD structured data for Google — ItemList of all products
async function CatalogStructuredData({ products }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Verma's Furnishing — Our Collection",
        "description": "Handcrafted luxury furniture catalog",
        "numberOfItems": products.length,
        "itemListElement": products.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Product",
                "name": product.name,
                "description": product.description,
                "image": `https://vermasfurnishing.com${product.image}`,
                "category": product.category,
                "brand": {
                    "@type": "Brand",
                    "name": "Verma's Furnishing"
                },
                "offers": {
                    "@type": "Offer",
                    "availability": "https://schema.org/InStock",
                    "priceCurrency": "INR",
                    "price": "0",
                    "priceValidUntil": "2027-12-31",
                    "url": `https://vermasfurnishing.com/product/${product.id}`
                }
            }
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export default async function CatalogPage({ searchParams }) {
    const resolvedParams = await searchParams;
    const categoryParam = resolvedParams?.category;
    const searchParam = resolvedParams?.search;

    const initialCategory = categoryParam && categories.includes(categoryParam) ? categoryParam : 'All';
    const initialSearch = searchParam || '';

    // Fetch products from database
    const dbProducts = await prisma.product.findMany({
        orderBy: { id: 'asc' }
    });

    // Format products for frontend (parsing JSON strings)
    const products = dbProducts.map(p => ({
        ...p,
        images: p.images ? JSON.parse(p.images) : undefined,
        features: p.features ? JSON.parse(p.features) : []
    }));

    return (
        <>
            <CatalogStructuredData products={products} />
            <CatalogClient
                initialProducts={products}
                categories={categories}
                initialCategory={initialCategory}
                initialSearch={initialSearch}
            />
        </>
    );
}
