'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';
import styles from './page.module.css';

export default function CatalogPage() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (searchParam) {
            setSearchQuery(searchParam);
            setActiveCategory('All'); // Reset category when searching
        } else if (categoryParam && categories.includes(categoryParam)) {
            setActiveCategory(categoryParam);
            setSearchQuery(''); // Reset search when category selected
        }
    }, [categoryParam, searchParam]);

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={styles.catalog}>
            {/* Header */}
            <section className={styles.header}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1>Our Collection</h1>
                    <p>Discover handcrafted furniture that transforms your space</p>
                </motion.div>
            </section>

            {/* Filters */}
            <section className={styles.filters}>
                <div className="container">
                    <div className={styles.filterBar}>
                        {/* Search */}
                        <div className={styles.searchBox}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        {/* Category Tabs */}
                        <div className={styles.categoryTabs}>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`${styles.tab} ${activeCategory === category ? styles.active : ''}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className={styles.productsSection}>
                <div className="container">
                    <p className={styles.resultCount}>
                        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                        {activeCategory !== 'All' && ` in ${activeCategory}`}
                    </p>

                    <motion.div
                        className={styles.productGrid}
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ProductCard product={product} index={index} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredProducts.length === 0 && (
                        <motion.div
                            className={styles.noResults}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <p>No products found. Try a different search or category.</p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2>Can't find what you're looking for?</h2>
                    <p>We also create custom furniture. Share your vision with us!</p>
                    <a
                        href="https://wa.me/919821197173?text=Hi, I'm looking for custom furniture. Can we discuss?"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp"
                    >
                        Request Custom Design
                    </a>
                </motion.div>
            </section>
        </div>
    );
}
