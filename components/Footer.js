'use client';

import { Instagram, Linkedin, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import styles from "./Footer.module.css";

const QUICK_LINKS = [
  { label: "Our Story", href: "/about" },
  { label: "Full Catalog", href: "/catalog" },
  { label: "Bespoke Service", href: "/catalog?search=custom" },
  { label: "Contact Us", href: "/contact" },
];

const CATEGORIES = [
  { label: "Sofas & Sectionals", href: "/catalog?category=Sofas" },
  { label: "Artisan Dining", href: "/catalog?category=Dining" },
  { label: "Luxury Headboards", href: "/catalog?category=Headboards" },
  { label: "Bespoke Curtains", href: "/catalog?category=Curtains" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
            {/* Real Contact Details Column */}
            <div className={styles.brandCol}>
                <h4 className={styles.getInTouchHeader}>GET IN TOUCH</h4>
                <div className={styles.contactDetails}>
                    <p>Mon - Sat: 10 am - 8 pm IST</p>
                    <p>Sundays: By Appointment</p>
                    <div className={styles.contactLinksRow}>
                        <p>Call Us: <a href="tel:+919821197173">+91 98211 97173</a></p>
                        <p>Email Us: <a href="mailto:vermasfurnishings@gmail.com">vermasfurnishings@gmail.com</a></p>
                    </div>
                </div>
                <div className={styles.socialShowcase}>
                    <a href="https://instagram.com/vermasfurnishings" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                        <Instagram size={18} />
                    </a>
                    <a href="https://www.linkedin.com/company/verma-s/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                        <Linkedin size={18} />
                    </a>
                    <a href="https://wa.me/919821197173" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                        <MessageSquare size={18} />
                    </a>
                </div>
            </div>

            <div className={styles.linksCol}>
                <div className={styles.linkGroup}>
                    <h4>Discovery</h4>
                    <ul>
                        {QUICK_LINKS.map(link => (
                            <li key={link.label}><Link href={link.href}>{link.label}</Link></li>
                        ))}
                    </ul>
                </div>
                <div className={styles.linkGroup}>
                    <h4>Collections</h4>
                    <ul>
                        {CATEGORIES.map(link => (
                            <li key={link.label}><Link href={link.href}>{link.label}</Link></li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={styles.newsletterCol}>
                <h4>Join the Inner Circle</h4>
                <p>Receive exclusive invitations to our seasonal collections and artisan workshops.</p>
                <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="Your email address" className={styles.newsletterInput} />
                    <button type="submit" className={styles.newsletterBtn}>
                        <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </div>

        <div className={styles.bottomSection}>
            <div className={styles.legalRow}>
                <p>© {new Date().getFullYear()} Verma's Furnishing. Handcrafted in India.</p>
                <div className={styles.legalLinks}>
                    <Link href="/privacy">Privacy</Link>
                    <Link href="/terms">Terms</Link>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
