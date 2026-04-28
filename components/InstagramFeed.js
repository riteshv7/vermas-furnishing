'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import styles from './InstagramFeed.module.css';

const feedItems = [
  { id: 1, src: '/products/craft-showroom.jpg', alt: 'Our artisans at work' },
  { id: 2, src: '/products/luxury-living-room.jpg', alt: 'Luxury living room setup' },
  { id: 3, src: '/products/emerald-corner-dining-full.jpg', alt: 'Emerald dining collection' },
  { id: 4, src: '/products/modern-grey-lounge.jpg', alt: 'Modern lounge chair detail' },
  { id: 5, src: '/products/royal-marble-dining-set.jpg', alt: 'Royal marble dining' },
  { id: 6, src: '/products/cream-boucle-walnut-sofa.jpg', alt: 'Bespoke walnut sofa' },
];

export default function InstagramFeed() {
  const instagramUrl = "https://instagram.com/vermasfurnishings";

  return (
    <section className={styles.section}>
      <div className="container">
        <header className={styles.header}>
          <div className={styles.label}>
            <Instagram size={14} />
            <span>Visual Journal</span>
          </div>
          <h2 className={styles.title}>Follow Our Journey</h2>
          <p className={styles.subtitle}>
            A behind-the-scenes look at our craftsmanship and latest installations.
          </p>
        </header>

        <div className={styles.grid}>
          {feedItems.map((item, index) => (
            <motion.a
              key={item.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className={styles.overlay}>
                  <Instagram size={28} color="white" strokeWidth={1.5} />
                  <span>View Post</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className={styles.footer}>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.followBtn}>
            FOLLOW @VERMASFURNISHINGS
          </a>
        </div>
      </div>
    </section>
  );
}
