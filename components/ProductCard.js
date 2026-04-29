'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { getShimmerDataUrl } from '@/lib/shimmer';
import styles from './ProductCard.module.css';
import { useToast } from '@/context/ToastContext'; // Added import

export default function ProductCard({ product, index = 0 }) {
    const router = useRouter();
    const { isInWishlist, toggleWishlist: toggleUserWishlist } = useUser(); // Renamed to avoid conflict
    const { trackEvent } = useAnalytics();
    const { addToast } = useToast(); // Initialized useToast
    const isLiked = isInWishlist(product.id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Support both single image and multiple images
    const images = product.images || [product.image];
    const hasMultipleImages = images.length > 1;

    const whatsappMessage = encodeURIComponent(
        `Hi, I'm interested in the "${product.name}". Can you share more details?`
    );

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleCardClick = (e) => {
        // Don't navigate if clicking buttons/dots or links
        if (e.target.closest('button') || e.target.closest('a')) {
            e.stopPropagation();
            return;
        }
        trackEvent('CLICK', { productId: product.id, productName: product.name });
        router.push(`/product/${product.id}`);
    };

    // Modified toggleWishlist logic to include toast
    const handleToggleWishlist = (e) => {
        e.stopPropagation();
        toggleUserWishlist(product); // Call the original toggle from context

        // Check if it was added to wishlist (assuming toggleUserWishlist updates context immediately)
        // We need to check the state *after* the toggle, so we check if it's *not* liked before the toggle
        // and then assume it became liked. Or, check the new state.
        // For simplicity, let's assume if it was NOT liked, it's now added.
        if (!isLiked) { // If it was not liked, and now it's toggled, it means it's added.
            addToast({
                title: 'Added to Wishlist',
                message: product.name,
                image: images[0]
            });
        }
        trackEvent('WISHLIST', {
            productId: product.id,
            action: isLiked ? 'remove' : 'add'
        });
    };

    return (
        <div
            className={styles.card}
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            <div className={styles.cardLink}>
                <div className={styles.imageWrapper}>
                    <button
                        className={`${styles.wishlistBtn} ${isLiked ? styles.wishlisted : ''}`}
                        onClick={handleToggleWishlist}
                        aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart
                            size={20}
                            fill={isLiked ? "currentColor" : "none"}
                            className={isLiked ? styles.heartActive : ""}
                        />
                    </button>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }}
                            drag={hasMultipleImages ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = offset.x * velocity.x;
                                if (swipe < -2000) {
                                    setCurrentImageIndex((prev) => (prev + 1) % images.length);
                                } else if (swipe > 2000) {
                                    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
                                }
                            }}
                        >
                            <Image
                                src={images[currentImageIndex]}
                                alt={`${product.name} - View ${currentImageIndex + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className={styles.image}
                                placeholder="blur"
                                blurDataURL={getShimmerDataUrl(700, 475)}
                            />
                            {hasMultipleImages && currentImageIndex === 0 && (
                                <Image
                                    src={images[1]}
                                    alt={`${product.name} - Alternate View`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className={styles.hoverImage}
                                    placeholder="blur"
                                    blurDataURL={getShimmerDataUrl(700, 475)}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Gallery Navigation Arrows */}
                    {hasMultipleImages && (
                        <>
                            <button
                                className={`${styles.galleryBtn} ${styles.prevBtn}`}
                                onClick={prevImage}
                                aria-label="Previous image"
                            >
                                ‹
                            </button>
                            <button
                                className={`${styles.galleryBtn} ${styles.nextBtn}`}
                                onClick={nextImage}
                                aria-label="Next image"
                            >
                                ›
                            </button>
                            <div className={styles.imageDots}>
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`${styles.dot} ${i === currentImageIndex ? styles.activeDot : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(i);
                                        }}
                                        aria-label={`View image ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}


                </div>
                <div className={styles.content}>
                    <h3 className={styles.name}>
                        <Link href={`/product/${product.id}`} className={styles.titleLink}>
                            {product.name}
                        </Link>
                    </h3>
                    <span className={styles.category}>{product.category}</span>
                </div>
            </div>
        </div>
    );
}
