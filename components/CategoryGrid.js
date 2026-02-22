'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import styles from './CategoryGrid.module.css';
import { trackEvent } from '@/lib/analytics';
import { getShimmerDataUrl } from '@/lib/shimmer';

const categories = [
    {
        id: 'sofas',
        name: 'Sofas',
        image: '/products/luxury-living-room.jpg',
        href: '/catalog?category=Sofas'
    },
    {
        id: 'dining',
        name: 'Dining Sets',
        image: '/products/green-cream-dining.jpg',
        href: '/catalog?category=Dining'
    },
    {
        id: 'headboards',
        name: 'Headboards',
        image: '/products/tufted-led-headboard.jpg',
        href: '/catalog?category=Headboards'
    },
    {
        id: 'chairs',
        name: 'Accent Chairs',
        image: '/products/pink-wingback-chairs.jpg',
        href: '/catalog?category=Chairs'
    },
    {
        id: 'tables',
        name: 'Coffee Tables',
        image: '/products/spiral-coffee-table-1.jpg',
        href: '/catalog?category=Tables'
    },
    {
        id: 'ottomans',
        name: 'Ottomans',
        image: '/products/teal-trunk-ottoman.jpg',
        href: '/catalog?category=Ottomans'
    }
];

export default function CategoryGrid() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Shop by Category</h2>
                    <p className={styles.subtitle}>Explore our curated collections designed to elevate every corner of your home.</p>
                </div>

                <div className={styles.grid}>
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={category.href}
                            className={styles.card}
                            onClick={() => {
                                trackEvent('CATEGORY_CLICK', { metadata: { category: category.name } });
                            }}
                        >
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className={styles.cardImage}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                placeholder="blur"
                                blurDataURL={getShimmerDataUrl(800, 600)}
                            />
                            <div className={styles.overlay}>
                                <div className={styles.content}>
                                    <h3 className={styles.categoryTitle}>{category.name}</h3>
                                    <div className={styles.link}>
                                        <span>Explore Collection</span>
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section >
    );
}
