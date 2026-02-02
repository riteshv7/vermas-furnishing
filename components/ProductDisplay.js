"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useUser } from '../context/UserContext';
import ProductCard from './ProductCard';
import { useAnalytics } from '@/hooks/useAnalytics';
import styles from '../app/product/[id]/page.module.css';

export default function ProductDisplay({ product, relatedProducts }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const { isInWishlist, toggleWishlist, user } = useUser();
    const { trackEvent } = useAnalytics();
    const isLiked = isInWishlist(product.id);

    // Handle both single image and multiple images array
    const images = product.images || [product.image];

    // Prepare slides for lightbox
    const slides = images.map(src => ({ src }));

    // WhatsApp Message
    const greeting = user?.name ? `Hi, I'm ${user.name}.` : "Hi,";
    const whatsappMessage = encodeURIComponent(
        `${greeting} I'm interested in the "${product.name}". Can you share more details?`
    );

    return (
        <div className={styles.container}>
            <div className="container">
                <Link href="/catalog" className={styles.backBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Catalog
                </Link>

                <motion.div
                    className={styles.productLayout}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Gallery Section */}
                    <div className={styles.gallery}>
                        {/* Desktop Interactive Image */}
                        <div className={styles.mainImageWrapper} onClick={() => setLightboxOpen(true)}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={styles.imageContainer}
                                >
                                    <Image
                                        src={images[currentImageIndex]}
                                        alt={`${product.name} - View ${currentImageIndex + 1}`}
                                        fill
                                        className={styles.mainImage}
                                        priority
                                    />
                                    <div className={styles.zoomHint}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 21l-4.35-4.35m2.85-5.65a8 8 0 11-16 0 8 8 0 0116 0zM11 11h.01" />
                                        </svg>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Mobile Swipe-to-Scroll Container */}
                        <div className={styles.mobileScrollContainer}>
                            {images.map((img, idx) => (
                                <div key={idx} className={styles.mobileSlide} onClick={() => {
                                    setCurrentImageIndex(idx);
                                    setLightboxOpen(true);
                                }}>
                                    <Image
                                        src={img}
                                        alt={`${product.name} - View ${idx + 1}`}
                                        fill
                                        className={styles.mainImage}
                                        priority={idx === 0}
                                    />
                                </div>
                            ))}
                        </div>

                        <Lightbox
                            open={lightboxOpen}
                            close={() => setLightboxOpen(false)}
                            index={currentImageIndex}
                            slides={slides}
                            on={{
                                view: ({ index }) => setCurrentImageIndex(index),
                            }}
                        />

                        {images.length > 1 && (
                            <div className={styles.thumbnails}>
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        className={`${styles.thumbnailButton} ${currentImageIndex === idx ? styles.activeThumbnail : ''}`}
                                        onClick={() => setCurrentImageIndex(idx)}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            fill
                                            className={styles.thumbnailImage}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className={styles.details}>
                        <div>
                            <span className={styles.category}>{product.category}</span>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h1 className={styles.title}>{product.name}</h1>
                                <button
                                    onClick={() => {
                                        toggleWishlist(product);
                                        trackEvent('WISHLIST', {
                                            productId: product.id,
                                            action: isLiked ? 'remove' : 'add'
                                        });
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: isLiked ? '#e31b23' : '#ccc',
                                        padding: '0.5rem',
                                        transition: 'transform 0.2s'
                                    }}
                                    className={isLiked ? styles.liked : ''}
                                    title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className={styles.divider} />

                        <p className={styles.description}>{product.description}</p>

                        {product.features && (
                            <div className={styles.features}>
                                <h3>Key Features</h3>
                                <ul className={styles.featureList}>
                                    {product.features.map((feature, idx) => (
                                        <li key={idx} className={styles.featureItem}>
                                            <div className={styles.featureIcon}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className={styles.actions}>
                            <a
                                href={`https://wa.me/919821197173?text=${whatsappMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.inquireBtn}
                                onClick={() => trackEvent('INQUIRE', { productId: product.id, productName: product.name })}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                Inquire on WhatsApp
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <motion.div
                        className={styles.relatedSection}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className={styles.relatedTitle}>Related Products</h2>
                        <div className={styles.relatedGrid}>
                            {relatedProducts.map((p, idx) => (
                                <ProductCard key={p.id} product={p} index={idx} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
