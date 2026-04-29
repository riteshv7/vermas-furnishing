'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

export default function CatalogClient({ initialProducts, categories, initialCategory, initialSearch }) {
    const [activeCategory, setActiveCategory] = useState(initialCategory || 'All');
    const [searchQuery, setSearchQuery] = useState(initialSearch || '');

    useEffect(() => {
        if (initialCategory) setActiveCategory(initialCategory);
        if (initialSearch !== undefined) setSearchQuery(initialSearch);
    }, [initialCategory, initialSearch]);

    // Smart Filter: Checks Name, Description, and Features
    const filteredProducts = initialProducts.filter(product => {
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        
        const q = searchQuery.toLowerCase().trim();
        if (!q) return matchesCategory;

        const matchesSearch = 
            product.name.toLowerCase().includes(q) ||
            (product.description && product.description.toLowerCase().includes(q)) ||
            (product.features && product.features.some(f => f.toLowerCase().includes(q)));
            
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
                        <div className={styles.searchBox}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name, material, or feature..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

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

                    <motion.div className={styles.productGrid}>
                        <AnimatePresence>
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredProducts.length === 0 && (
                        <div className={styles.noResults}>
                            <p>No products found matching "{searchQuery}". Try searching for something else!</p>
                        </div>
                    )}
                </div>
            </section>

            <section className={styles.cta}>
                <div className="container">
                    <h2>Can't find what you're looking for?</h2>
                    <p>We also create custom furniture. Share your vision with us!</p>
                    <a
                        href="https://wa.me/919821197173?text=Hi, I'm looking for custom furniture."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp"
                    >
                        Request Custom Design
                    </a>
                </div>
            </section>
        </div>
    );
}
