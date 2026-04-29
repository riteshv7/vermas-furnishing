'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useUser } from '../context/UserContext';
import styles from './Navbar.module.css';

import { trackEvent } from '@/lib/analytics';

export default function Navbar() {
    const { data: session } = useSession();
    const { wishlist } = useUser();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 80) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
        setHidden(false);
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            trackEvent('SEARCH', { metadata: { query: searchQuery } });
            router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/catalog', label: 'Catalog' },
        { href: '/about', label: 'Our Story' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <motion.nav
            className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" }
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
        >
            <div className={styles.container}>
                {/* Logo - Left Side */}
                <Link href="/" className={styles.logo}>
                    <img
                        src="/logo.svg"
                        alt="Verma's Furnishing"
                        className={styles.logoImage}
                        style={{ height: '36px', width: 'auto', display: 'block' }}
                    />
                </Link>

                {/* Right Section - Nav Links, Search */}
                <div className={styles.rightSection}>
                    {/* Desktop Links */}
                    <ul className={styles.navLinks}>
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className={styles.navLink}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Search */}
                    <div className={styles.searchContainer}>
                        <form onSubmit={handleSearch} className={`${styles.searchForm} ${isSearchOpen ? styles.searchOpen : ''}`}>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button
                                type="button"
                                className={styles.searchBtn}
                                aria-label="Search"
                                onClick={() => isSearchOpen ? handleSearch({ preventDefault: () => { } }) : setIsSearchOpen(true)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Shopping Bag Icon */}
                    <Link href="/cart" className={styles.wishlistBtn} aria-label="Shopping Bag">
                        <ShoppingBag size={22} strokeWidth={1.5} />
                        {wishlist.length > 0 && (
                            <span className={styles.wishlistBadge}>{wishlist.length}</span>
                        )}
                    </Link>

                    {/* Account Icon */}
                    <Link href="/account" className={styles.iconBtn} aria-label="My Account">
                        {session?.user ? (
                            <div className={styles.userAvatar}>
                                {session.user.image ? (
                                    <Image src={session.user.image} alt={session.user.name} width={24} height={24} className={styles.avatarImg} />
                                ) : (
                                    <span className={styles.avatarInitial}>{session.user.name?.charAt(0)}</span>
                                )}
                            </div>
                        ) : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        )}
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className={styles.mobileMenuBtn}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className={styles.mobileMenu}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={styles.mobileNavLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
