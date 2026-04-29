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
        description: "Transform your space with our handcrafted sofas, dining sets, curtains, and accent furniture. Made in Mumbai, delivered across India.",
        image: "/hero-bg.jpg",
        cta: "View Collection",
        link: "/catalog"
    },
    {
        id: 1,
        tagline: "The Art of Living",
        title: "Modern Bouclé",
        highlight: "Walnut Collection",
        description: "Experience the tactile beauty of handcrafted bouclé upholstery paired with solid walnut accents. Timeless design for the modern home.",
        image: "/products/cream-boucle-walnut-sofa.jpg",
        cta: "Explore Sofas",
        link: "/catalog?category=Sofas"
    },
    {
        id: 2,
        tagline: "Regal Dining",
        title: "Emerald Corner",
        highlight: "Bespoke Dining",
        description: "A statement in royalty. Our emerald velvet collection combined with hand-finished surfaces brings a new dimension to your dining space.",
        image: "/products/emerald-corner-dining-full.jpg",
        cta: "View Dining",
        link: "/catalog?category=Dining"
    }
];

export default function Hero() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % SLIDES.length);
        }, 8000); // Slightly slower (8s) so they can read the first slide comfortably
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

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
                        initial={{ scale: 1.1, opacity: 0.9 }}
                        animate={{ scale: 1, opacity: 1 }}
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

                    <div className={styles.content}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <span className={styles.tagline}>{SLIDES[current].tagline}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            {SLIDES[current].title}
                            <br />
                            <span className={styles.highlight}>{SLIDES[current].highlight}</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            {SLIDES[current].description}
                        </motion.p>

                        <motion.div
                            className={styles.buttons}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                        >
                            <Link href={SLIDES[current].link} className="btn btn-primary">
                                {SLIDES[current].cta}
                            </Link>
                            <a
                                href="https://wa.me/919821197173?text=Hi, I'm interested in your products"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-whatsapp"
                            >
                                Free Consultation
                            </a>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            <div className={styles.controls}>
                <button onClick={prevSlide} className={styles.controlBtn}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <div className={styles.indicators}>
                    {SLIDES.map((_, i) => (
                        <div 
                            key={i} 
                            className={`${styles.indicator} ${current === i ? styles.activeIndicator : ''}`}
                            onClick={() => setCurrent(i)}
                        ></div>
                    ))}
                </div>
                <button onClick={nextSlide} className={styles.controlBtn}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>
        </section>
    );
}
