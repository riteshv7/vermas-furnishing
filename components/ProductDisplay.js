"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
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
    const slides = images.map(src => ({ 
        src,
        width: 1920,
        height: 1280,
    }));

    // WhatsApp Message
    const greeting = user?.name ? `Hi, I'm ${user.name}.` : "Hi,";
    const whatsappMessage = encodeURIComponent(
        `${greeting} I'm interested in the "${product.name}". Can you share more details?`
    );

    // Share link
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareMessage = encodeURIComponent(
        `Check out this beautiful "${product.name}" from Verma's Furnishing: ${shareUrl}`
    );

    // ── Feature 2: Native Share (Web Share API) ──
    const handleNativeShare = async () => {
        trackEvent('SHARE', { productId: product.id, productName: product.name });
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${product.name} — Verma's Furnishing`,
                    text: `Check out this beautiful "${product.name}" from Verma's Furnishing!`,
                    url: window.location.href,
                });
            } catch (err) {
                // User cancelled — that's fine
            }
        } else {
            // Fallback: copy link to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    // ── Feature 5: Swipe support for touch devices ──
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentImageIndex < images.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
        }
        if (isRightSwipe && currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
        }
    };

    return (
        <div className={styles.container}>

            {/* Back Button */}
            <div className="container">
                <Link href="/catalog" className={styles.backBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }}>
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Catalog
                </Link>
            </div>

            {/* Main Product Layout */}
            <motion.div
                className={styles.productLayout}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Gallery Section */}
                <div className={styles.gallery}>
                    <div 
                        className={styles.mainImageWrapper} 
                        onClick={() => setLightboxOpen(true)}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        style={{ cursor: 'zoom-in' }}
                    >
                        <div className={styles.zoomHint}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                            <span>Click to Inspect Craftsmanship</span>
                        </div>

                        {/* Image counter for mobile/tablet */}
                        {images.length > 1 && (
                            <div className={styles.imageCounter}>
                                {currentImageIndex + 1} / {images.length}
                            </div>
                        )}

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
                                    alt={`${product.name}`}
                                    fill
                                    className={styles.mainImage}
                                    priority={currentImageIndex === 0}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 50vw"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

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
                                        alt="" 
                                        fill 
                                        className={styles.thumbnailImage} 
                                        sizes="80px"
                                        loading="lazy"
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
                            <h2 className={styles.title}>{product.name}</h2>
                            <button
                                onClick={() => {
                                    toggleWishlist(product);
                                    trackEvent('WISHLIST', { productId: product.id, action: isLiked ? 'remove' : 'add' });
                                }}
                                className={styles.wishlistBtn}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLiked ? '#e31b23' : '#d4c3bc' }}
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className={styles.divider} />
                    <p className={styles.description}>{product.description}</p>

                    {product.features?.length > 0 && (
                        <div className={styles.features}>
                            <h3>Key Features</h3>
                            <ul className={styles.featureList}>
                                {product.features.map((feature, idx) => (
                                    <li key={idx} className={styles.featureItem}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Desktop Actions (hidden on mobile/tablet — they use the sticky bar instead) */}
                    <div className={styles.desktopActions}>
                        <a
                            href={`https://wa.me/919821197173?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.inquireBtn}
                            onClick={() => trackEvent('INQUIRE', { productId: product.id, productName: product.name })}
                        >
                            Inquire via WhatsApp
                        </a>
                        
                        <div style={{ marginTop: '1rem' }}>
                            <button onClick={handleNativeShare} className={styles.nativeShareBtn}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                    <polyline points="16 6 12 2 8 6"></polyline>
                                    <line x1="12" y1="2" x2="12" y2="15"></line>
                                </svg>
                                Share with Family
                            </button>
                        </div>

                    </div>
                </div>
            </motion.div>

            {relatedProducts.length > 0 && (
                <section className={styles.relatedSection}>
                    <h2 className={styles.relatedTitle}>You May Also Like</h2>
                    <div className={styles.relatedGrid}>
                        {relatedProducts.map((p, idx) => (
                            <ProductCard key={p.id} product={p} index={idx} />
                        ))}
                    </div>
                </section>
            )}

            {/* ── Feature 1: Sticky WhatsApp Bar (mobile/tablet only, CSS-controlled) ── */}
            <div className={styles.stickyBar}>
                <button onClick={handleNativeShare} className={styles.stickyShareBtn} aria-label="Share this product">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                </button>
                <a
                    href={`https://wa.me/919821197173?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.stickyInquireBtn}
                    onClick={() => trackEvent('INQUIRE', { productId: product.id, productName: product.name })}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Inquire Now
                </a>
            </div>
            
            <Lightbox 
                open={lightboxOpen} 
                close={() => setLightboxOpen(false)} 
                index={currentImageIndex} 
                slides={slides} 
                plugins={[Zoom, Thumbnails]}
                zoom={{
                    maxZoomPixelRatio: 3,
                    zoomInMultiplier: 2,
                    doubleTapDelay: 300,
                    doubleClickDelay: 300,
                    doubleClickMaxStops: 2,
                    keyboardMoveDistance: 50,
                    wheelZoomDistanceFactor: 100,
                    pinchZoomDistanceFactor: 100,
                }}
                styles={{
                    container: { backgroundColor: "rgba(0, 0, 0, 0.95)", backdropFilter: "blur(10px)" },
                    thumbnailsContainer: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                }}
            />
        </div>
    );
}
