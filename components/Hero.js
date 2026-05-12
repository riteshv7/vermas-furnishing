'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

const SLIDES = [
    {
        id: 0,
        tagline: "Comfort | Craftsmanship | Class",
        title: "Crafting Premium",
        highlight: "Home Furnishings",
        image: "/hero-bg.jpg",
        cta: "Shop Collection",
        link: "/catalog",
        motto: "Live Well. Live Verma's."
    },
    {
        id: 1,
        tagline: "The Art of Living",
        title: "Modern Bouclé",
        highlight: "Walnut Collection",
        image: "/products/cream-boucle-walnut-sofa.jpg",
        cta: "Shop New Arrivals",
        link: "/catalog?category=Sofas",
        motto: "Handcrafted in Mumbai."
    },
    {
        id: 2,
        tagline: "Regal Dining",
        title: "Emerald Corner",
        highlight: "Bespoke Dining",
        image: "/products/emerald-corner-dining-full.jpg",
        cta: "View Dining",
        link: "/catalog?category=Dining",
        motto: "A Statement in Royalty."
    }
];

export default function Hero() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % SLIDES.length);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className={styles.hero}>
            <AnimatePresence mode="wait">
                <motion.div 
                    key={current}
                    className={styles.slideContainer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                    <motion.div 
                        className={styles.bgWrapper}
                        initial={{ scale: 1.08 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 8, ease: "easeOut" }}
                    >
                        <Image
                            src={SLIDES[current].image}
                            alt={SLIDES[current].title}
                            fill
                            priority
                            className={styles.bgImage}
                            sizes="100vw"
                        />
                    </motion.div>
                    
                    <div className={styles.overlay}></div>

                    {/* Bottom-left editorial content */}
                    <div className={styles.content}>
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className={styles.ctaWrap}
                        >
                            <Link href={SLIDES[current].link} className={styles.ctaBtn}>
                                {SLIDES[current].cta}
                            </Link>
                        </motion.div>

                        <motion.p
                            className={styles.motto}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            {SLIDES[current].motto}
                        </motion.p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dot indicators — bottom center */}
            <div className={styles.controls}>
                <div className={styles.indicators}>
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.indicator} ${current === i ? styles.activeIndicator : ''}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
