import { redirect } from 'next/navigation';
import { products } from '../../../data/products';
import ProductDisplay from '../../../components/ProductDisplay';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = products.find(p => p.id === parseInt(id));

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
    const product = products.find(p => p.id === productId);

    if (!product) {
        redirect('/catalog');
    }

    // Find related products
    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
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
