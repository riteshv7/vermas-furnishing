import { products, categories } from '@/data/products';
import CatalogClient from './CatalogClient';

export const metadata = {
    title: "Our Collection | Handcrafted Sofas, Dining & Headboards | Verma's Furnishing",
    description: "Browse our curated catalog of handcrafted sofas, marble dining sets, tufted headboards, accent chairs and bespoke furniture. Made in Mumbai, delivered across India.",
    openGraph: {
        title: "Our Collection | Verma's Furnishing",
        description: "Browse our curated catalog of handcrafted sofas, marble dining sets, tufted headboards, accent chairs and bespoke furniture.",
        type: 'website',
    },
};

// JSON-LD structured data for Google — ItemList of all products
function CatalogStructuredData() {
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

    return (
        <>
            <CatalogStructuredData />
            <CatalogClient
                initialProducts={products}
                categories={categories}
                initialCategory={initialCategory}
                initialSearch={initialSearch}
            />
        </>
    );
}
