import { ProductGridSkeleton } from '@/components/SkeletonLoader';
import styles from './page.module.css';

export default function CatalogLoading() {
    return (
        <div className={styles.catalog}>
            {/* Header Skeleton */}
            <section className={styles.header}>
                <div style={{ opacity: 0.5 }}>
                    <h1>Loading Collection...</h1>
                    <p>Preparing handcrafted furniture</p>
                </div>
            </section>

            {/* Filters Skeleton area */}
            <section className={styles.filters}>
                <div className="container">
                    <div className={styles.filterBar} style={{ opacity: 0.5 }}>
                        <div className={styles.searchBox} style={{ maxWidth: '400px', height: '46px' }}></div>
                        <div className={styles.categoryTabs}>
                            <div className={styles.tab} style={{ width: '80px', height: '40px' }}></div>
                            <div className={styles.tab} style={{ width: '120px', height: '40px' }}></div>
                            <div className={styles.tab} style={{ width: '100px', height: '40px' }}></div>
                            <div className={styles.tab} style={{ width: '90px', height: '40px' }}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid Skeleton */}
            <section className={styles.productsSection}>
                <div className="container">
                    <p className={styles.resultCount} style={{ opacity: 0.5 }}>Loading products...</p>
                    <ProductGridSkeleton count={6} />
                </div>
            </section>
        </div>
    );
}
