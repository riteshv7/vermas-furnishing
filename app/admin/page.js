"use client";

import { useEffect, useState } from 'react';
import styles from './admin.module.css';
import { products } from '@/data/products';

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false); // Start false until auth
    const [error, setError] = useState(null);

    const handleLogin = (e) => {
        e.preventDefault();
        if (accessCode === 'Verma2024!') {
            setIsAuthenticated(true);
            localStorage.setItem('verma_internal', 'true');
            fetchData();
        } else {
            setError('Invalid Access Code');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/analytics', {
                headers: {
                    'x-admin-code': 'Verma2024!'
                }
            });
            const result = await res.json();

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    // Remove automatic useEffect fetch, wait for login
    // useEffect(() => {
    //     fetchData();
    // }, []);

    const getProductName = (id) => {
        const product = products.find(p => p.id === id);
        return product ? product.name : 'Unknown Product';
    };

    const getMetricValue = (type) => {
        if (!data?.totals) return 0;
        const metric = data.totals.find(t => t.type === type);
        return metric ? metric._count.type : 0;
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                    <h1 className={styles.title}>Admin Access</h1>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                        <input
                            type="password"
                            placeholder="Enter Access Code"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
                        />
                        <button type="submit" className={styles.refreshButton} style={{ width: '100%' }}>
                            Login
                        </button>
                    </form>
                    {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                </div>
            </div>
        );
    }

    if (loading && !data) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (error) {
        return <div className={styles.container}>
            <p>Error: {error}</p>
            <button onClick={fetchData} className={styles.refreshButton}>Retry</button>
        </div>;
    }

    const totalViews = getMetricValue('VIEW');
    const totalClicks = getMetricValue('CLICK');
    const totalInquiries = getMetricValue('INQUIRE');
    const totalWishlist = getMetricValue('WISHLIST');

    const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;
    const inquiryRate = totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(1) : 0;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch('/api/analytics?export=csv', {
                                    headers: { 'x-admin-code': 'Verma2024!' }
                                });
                                if (!res.ok) throw new Error('Export failed');
                                const blob = await res.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'analytics_export.csv';
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                a.remove();
                            } catch (e) {
                                alert('Failed to download CSV');
                            }
                        }}
                        className={styles.refreshButton}
                        style={{ backgroundColor: '#4CAF50' }}
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={fetchData}
                        className={styles.refreshButton}
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
            </header>

            <div className={styles.metricsGrid}>
                {/* ... existing metrics ... */}
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Total Page Views</div>
                    <div className={styles.metricValue}>{totalViews}</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Product Clicks</div>
                    <div className={styles.metricValue}>{totalClicks}</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Inquiries</div>
                    <div className={styles.metricValue}>{totalInquiries}</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Wishlist Adds</div>
                    <div className={styles.metricValue}>{totalWishlist}</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Click Through Rate</div>
                    <div className={styles.metricValue}>{clickRate}%</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Inquiry Rate</div>
                    <div className={styles.metricValue}>{inquiryRate}%</div>
                </div>
            </div>

            {/* New Audience Insights Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Audience Insights</h2>
                <div className={styles.metricsGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

                    {/* Device Usage */}
                    <div className={styles.metricCard} style={{ alignItems: 'flex-start', padding: '1.5rem' }}>
                        <h3 className={styles.cardTitle} style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#555' }}>Device Usage</h3>
                        <div style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Mobile</span>
                                <b>{data?.stats?.devices?.Mobile || 0}</b>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#eee', borderRadius: '3px', marginBottom: '1rem' }}>
                                <div style={{
                                    width: `${((data?.stats?.devices?.Mobile || 0) / (totalViews || 1)) * 100}%`,
                                    height: '100%',
                                    background: '#B57EDC',
                                    borderRadius: '3px'
                                }}></div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Desktop</span>
                                <b>{data?.stats?.devices?.Desktop || 0}</b>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#eee', borderRadius: '3px' }}>
                                <div style={{
                                    width: `${((data?.stats?.devices?.Desktop || 0) / (totalViews || 1)) * 100}%`,
                                    height: '100%',
                                    background: '#4CAF50',
                                    borderRadius: '3px'
                                }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Top Searches */}
                    <div className={styles.metricCard} style={{ alignItems: 'flex-start', padding: '1.5rem' }}>
                        <h3 className={styles.cardTitle} style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#555' }}>Top Search Queries</h3>
                        {data?.stats?.topSearches?.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
                                {data.stats.topSearches.map(([term, count], i) => (
                                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                                        <span style={{ textTransform: 'capitalize' }}>"{term}"</span>
                                        <span style={{ fontWeight: 'bold', color: '#888' }}>{count}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: '#999', fontStyle: 'italic' }}>No search data yet</p>
                        )}
                    </div>

                    {/* Popular Categories */}
                    <div className={styles.metricCard} style={{ alignItems: 'flex-start', padding: '1.5rem' }}>
                        <h3 className={styles.cardTitle} style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#555' }}>Popular Categories</h3>
                        {data?.stats?.topCategories?.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
                                {data.stats.topCategories.map(([cat, count], i) => (
                                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                                        <span>{cat}</span>
                                        <span style={{ fontWeight: 'bold', color: '#888' }}>{count}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: '#999', fontStyle: 'italic' }}>No category data yet</p>
                        )}
                    </div>

                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Top Viewed Products</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>ID</th>
                                <th>Views</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.topViewed?.map((item, index) => (
                                <tr key={index}>
                                    <td className={styles.productName}>
                                        {getProductName(item.productId)}
                                    </td>
                                    <td><span className={styles.productId}>{item.productId}</span></td>
                                    <td>{item._count.productId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>High Interaction Products (Clicks, Inquiries, Wishlist)</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Interaction Type</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.topInteracted?.map((item, index) => (
                                <tr key={index}>
                                    <td className={styles.productName}>
                                        {getProductName(item.productId)}
                                    </td>
                                    <td>
                                        <span className={`${styles.eventType} ${styles['type' + item.type]}`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td>{item._count.productId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Recent Activity</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Event</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.recent?.map((event) => (
                                <tr key={event.id}>
                                    <td>{new Date(event.createdAt).toLocaleString()}</td>
                                    <td>
                                        <span className={`${styles.eventType} ${styles['type' + event.type]}`}>
                                            {event.type}
                                        </span>
                                    </td>
                                    <td>
                                        {event.productId ? (
                                            <>Product: <span className={styles.productName}>{getProductName(event.productId)}</span></>
                                        ) : (
                                            event.path
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
