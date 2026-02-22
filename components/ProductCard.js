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
        <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
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

                    <div className={styles.overlay}>
                        <a
                            href={`https://wa.me/919821197173?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.inquireBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                trackEvent('INQUIRE', { productId: product.id, productName: product.name });
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Inquire
                        </a>
                    </div>
                    <span className={styles.category}>{product.category}</span>
                </div>

                <div className={styles.content}>
                    <h3 className={styles.name}>
                        <Link href={`/product/${product.id}`} className={styles.titleLink}>
                            {product.name}
                        </Link>
                    </h3>
                    <p className={styles.description}>{product.description}</p>

                    {product.features && (
                        <div className={styles.features}>
                            {product.features.map((feature, i) => (
                                <span key={i} className={styles.feature}>{feature}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
