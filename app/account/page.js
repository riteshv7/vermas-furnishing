"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';
// Import products to hydrate wishlist
import { products } from '@/data/products';

export default function AccountPage() {
    const { user, saveUser, wishlist, isLoaded } = useUser();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [loginPhone, setLoginPhone] = useState('');

    useEffect(() => {
        if (user && user.phone) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    if (!isLoaded) return <div className={styles.container}><p>Loading...</p></div>;

    if (!user.phone) {
        return (
            <div className={styles.container}>
                <div className={styles.authSection}>
                    <h2 className={styles.authTitle}>Login / Register</h2>
                    <p style={{ marginBottom: '1rem', color: '#666' }}>Enter your phone number to access your wishlist and profile.</p>
                    <form className={styles.form} onSubmit={(e) => {
                        e.preventDefault();
                        if (loginPhone.trim().length >= 10) saveUser({ phone: loginPhone });
                    }}>
                        <input
                            className={styles.input}
                            placeholder="Phone Number"
                            value={loginPhone}
                            onChange={e => setLoginPhone(e.target.value)}
                            type="tel"
                            required
                        />
                        <button className={styles.button}>Continue</button>
                    </form>
                </div>
            </div>
        );
    }

    // Filter products to show only wishlist items
    const wishlistItems = products.filter(p => wishlist.some(w => w.id === p.id));

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Account</h1>

            <div className={styles.profileSection}>
                <h2 className={styles.sectionTitle}>Profile Details</h2>
                <form className={styles.profileGrid} onSubmit={(e) => {
                    e.preventDefault();
                    saveUser(formData);
                    alert("Profile updated!");
                }}>
                    <div className={styles.field}>
                        <label className={styles.label}>Name</label>
                        <input
                            className={styles.input}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your Name"
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Email</label>
                        <input
                            className={styles.input}
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            type="email"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Phone</label>
                        <input
                            className={styles.input}
                            value={formData.phone}
                            disabled
                            style={{ background: '#eee', cursor: 'not-allowed' }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button className={styles.button} style={{ width: '100%' }}>Save Changes</button>
                    </div>
                </form>
            </div>

            <div className={styles.wishlistSection}>
                <h2 className={styles.sectionTitle}>My Wishlist ({wishlist.length})</h2>
                {wishlistItems.length > 0 ? (
                    <div className={styles.wishlistGrid}>
                        {wishlistItems.map((p, idx) => (
                            <ProductCard key={p.id} product={p} index={idx} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p>Your wishlist is empty. Browse the catalog to add items.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
