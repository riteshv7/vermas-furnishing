import { Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand */}
                    <div className={styles.brand}>
                        <h3>VERMA'S</h3>
                        <p>Comfort | Craftsmanship | Class</p>
                        <p className={styles.address}>
                            Shop No. 4, Siddheshwar Society,<br />
                            Bandra (E), Mumbai - 400051<br />
                            Manufacturing Unit
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.links}>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/catalog">Catalog</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className={styles.links}>
                        <h4>Categories</h4>
                        <ul>
                            <li><Link href="/catalog?category=Sofas">Sofas</Link></li>
                            <li><Link href="/catalog?category=Dining">Dining</Link></li>
                            <li><Link href="/catalog?category=Chairs">Chairs</Link></li>
                            <li><Link href="/catalog?category=Curtains">Curtains</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className={styles.contact}>
                        <h4>Get in Touch</h4>
                        <a href="tel:+919821197173" className={styles.contactItem}>
                            📞 +91 9821197173
                        </a>
                        <a href="mailto:vermasfurnishings@gmail.com" className={styles.contactItem}>
                            ✉️ vermasfurnishings@gmail.com
                        </a>
                        <a
                            href="https://wa.me/919821197173"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappLink}
                        >
                            💬 Chat on WhatsApp
                        </a>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© 2026 Verma's Furnishing. All rights reserved.</p>
                    <div className={styles.socials}>
                        <a
                            href="https://instagram.com/vermasfurnishings"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="Instagram"
                        >
                            <Instagram size={24} />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/verma-s/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={24} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
