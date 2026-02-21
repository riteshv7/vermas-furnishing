'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ShopTheLook.module.css';

// Sample data - normally would come from props or a CMS
const LOOK_DATA = {
    image: '/images/living-room-demo.jpg', // Placeholder, we'll use a sample or existing image
    title: 'Shop The Look',
    description: 'Hover over the dots to explore the pieces in this curated living space.',
    hotspots: [
        {
            id: 'sofa-1',
            x: 50, // % from left
            y: 70, // % from top
            product: {
                id: 1, // Matches a real product ID from products.js if possible
                name: 'Modern Velvet Sofa',
                price: '₹45,000',
                image: '/products/modern-velvet-sofa.jpg'
            }
        },
        {
            id: 'chair-1',
            x: 25,
            y: 60,
            product: {
                id: 2,
                name: 'Accent Lounge Chair',
                price: '₹18,500',
                image: '/products/accent-chair-grey.jpg'
            }
        },
        {
            id: 'table-1',
            x: 75,
            y: 80,
            product: {
                id: 3,
                name: 'Marble Target Table',
                price: '₹22,000',
                image: '/products/marble-coffee-table.jpg'
            }
        }
    ]
};

export default function ShopTheLook() {
    const [activeHotspot, setActiveHotspot] = useState(null);
    const router = useRouter();

    // Use an existing image if the specific sample hasn't been uploaded yet
    const bgImage = '/products/modern-velvet-sofa.jpg';

    return (
        <section className={styles.container}>
            <div className="container">
                <div className={styles.header}>
                    <h2>{LOOK_DATA.title}</h2>
                    <p>{LOOK_DATA.description}</p>
                </div>

                <div className={styles.imageContainer}>
                    <Image
                        src={bgImage}
                        alt="Curated Room Design"
                        fill
                        sizes="100vw"
                        className={styles.roomImage}
                        priority
                    />

                    {LOOK_DATA.hotspots.map((hotspot) => (
                        <div
                            key={hotspot.id}
                            className={styles.hotspot}
                            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                            onMouseEnter={() => setActiveHotspot(hotspot.id)}
                            onMouseLeave={() => setActiveHotspot(null)}
                        >
                            <div className={styles.dot}>
                                <div className={styles.dotInner}></div>
                            </div>

                            <AnimatePresence>
                                {activeHotspot === hotspot.id && (
                                    <motion.div
                                        className={styles.tooltip}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className={styles.productImage}>
                                            <Image
                                                src={hotspot.product.image}
                                                alt={hotspot.product.name}
                                                fill
                                                sizes="200px"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className={styles.productInfo}>
                                            <h4>{hotspot.product.name}</h4>
                                            <p>{hotspot.product.price}</p>
                                            <button
                                                className={styles.viewBtn}
                                                onClick={() => router.push(`/product/${hotspot.product.id}`)}
                                            >
                                                View Product
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
