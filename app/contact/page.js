'use client';

import { motion } from 'framer-motion';
import styles from './page.module.css';

export default function ContactPage() {
    return (
        <div className={styles.contact}>
            {/* Header */}
            <section className={styles.header}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1>Get in Touch</h1>
                    <p>We'd love to hear from you. Let's create something beautiful together.</p>
                </motion.div>
            </section>

            {/* Content */}
            <section className={styles.content}>
                <div className="container">
                    <div className={styles.grid}>
                        {/* Contact Info */}
                        <motion.div
                            className={styles.info}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2>Contact Information</h2>
                            <p>
                                Visit our showroom or reach out to us. We're here to help you
                                transform your space with beautiful furniture.
                            </p>

                            <div className={styles.infoItems}>
                                <div className={styles.infoItem}>
                                    <span className={styles.icon}>📍</span>
                                    <div>
                                        <h4>Manufacturing Unit</h4>
                                        <p>Shop No. 4, Siddheshwar Society,</p>
                                        <p>Siddhart Nagar, Near Teacher Colony,</p>
                                        <p>Bandra (E), Mumbai - 400051</p>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <span className={styles.icon}>📞</span>
                                    <div>
                                        <h4>Phone / WhatsApp</h4>
                                        <a href="tel:+919821197173">+91 9821197173</a>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <span className={styles.icon}>✉️</span>
                                    <div>
                                        <h4>Email</h4>
                                        <a href="mailto:vermasfurnishings@gmail.com">vermasfurnishings@gmail.com</a>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <span className={styles.icon}>🕐</span>
                                    <div>
                                        <h4>Business Hours</h4>
                                        <p>Monday - Saturday: 10AM - 7PM</p>
                                        <p className={styles.sub}>Sunday: By Appointment</p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="https://wa.me/919821197173?text=Hi, I'd like to schedule a visit to your showroom"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`btn btn-whatsapp ${styles.whatsappBtn}`}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                Chat on WhatsApp
                            </a>

                            <div className={styles.social}>
                                <a
                                    href="https://instagram.com/vermasfurnishings"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                >
                                    📸 @vermasfurnishings on Instagram
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/verma-s/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                >
                                    💼 Verma's Furnishing on LinkedIn
                                </a>
                            </div>
                        </motion.div>

                        {/* Map */}
                        <motion.div
                            className={styles.mapSection}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div className={styles.mapWrapper}>
                                <iframe
                                    src="https://maps.google.com/maps?q=Siddheshwar%20Society%2C%20Siddhart%20Nagar%2C%20Bandra%20East%2C%20Mumbai&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Verma's Furnishing Location"
                                ></iframe>
                            </div>
                            <p className={styles.mapNote}>
                                📍 Shop No. 4, Siddheshwar Society, Bandra (E), Mumbai - 400051.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
