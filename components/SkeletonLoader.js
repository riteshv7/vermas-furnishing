import styles from './SkeletonLoader.module.css';

export function ProductSkeleton() {
    return (
        <div className={styles.card}>
            <div className={`${styles.skeleton} ${styles.imageArea}`}></div>
            <div className={styles.contentArea}>
                <div className={`${styles.skeleton} ${styles.titleLine}`}></div>
                <div className={`${styles.skeleton} ${styles.descLine}`}></div>
                <div className={`${styles.skeleton} ${styles.descLineShort}`}></div>

                <div className={styles.tagArea}>
                    <div className={`${styles.skeleton} ${styles.tag}`}></div>
                    <div className={`${styles.skeleton} ${styles.tag}`}></div>
                    <div className={`${styles.skeleton} ${styles.tag}`}></div>
                </div>
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 6 }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '30px',
            width: '100%'
        }}>
            {Array.from({ length: count }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
}
