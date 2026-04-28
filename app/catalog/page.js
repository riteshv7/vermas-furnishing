import { Suspense } from 'react';
import { products, categories } from '@/data/products';
import CatalogClient from './CatalogClient';
import styles from './page.module.css';

export default async function CatalogPage({ searchParams }) {
    // In Next.js 15, searchParams is a Promise. Let's await it.
    const resolvedParams = await searchParams;
    const categoryParam = resolvedParams.category;
    const searchParam = resolvedParams.search;

    const initialCategory = categoryParam && categories.includes(categoryParam) ? categoryParam : 'All';
    const initialSearch = searchParam || '';

    return (
        <Suspense fallback={<div className={styles.loading}>Loading catalog...</div>}>
            <CatalogClient 
                initialProducts={products} 
                categories={categories}
                initialCategory={initialCategory}
                initialSearch={initialSearch}
            />
        </Suspense>
    );
}
