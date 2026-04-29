"use client";

import { useEffect, useState } from 'react';
import styles from './admin.module.css';

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [activeTab, setActiveTab] = useState('analytics'); 
    const [hideInternal, setHideInternal] = useState(true);
    
    // Analytics Data
    const [data, setData] = useState(null);
    
    // Product Data
    const [productList, setProductList] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const savedCode = localStorage.getItem('verma_admin_code');
        if (savedCode) {
            setAccessCode(savedCode);
            setIsAuthenticated(true);
            fetchAnalytics(savedCode, hideInternal);
            fetchProducts(savedCode);
        }
    }, []);

    // Re-fetch analytics when toggle changes
    useEffect(() => {
        if (isAuthenticated) {
            fetchAnalytics(accessCode, hideInternal);
        }
    }, [hideInternal]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/analytics?hideInternal=${hideInternal}`, {
                headers: { 'x-admin-code': accessCode }
            });
            const result = await res.json();
            
            if (result.success) {
                setIsAuthenticated(true);
                localStorage.setItem('verma_internal', 'true');
                localStorage.setItem('verma_admin_code', accessCode);
                setData(result.data);
                fetchProducts(accessCode);
            } else {
                setError('Invalid Access Code');
            }
        } catch (err) {
            setError('Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async (codeToUse = accessCode, hide = hideInternal) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/analytics?hideInternal=${hide}`, {
                headers: { 'x-admin-code': codeToUse }
            });
            const result = await res.json();
            if (result.success) setData(result.data);
        } catch (err) {
            console.error('Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (codeToUse = accessCode) => {
        try {
            const res = await fetch('/api/admin/products', {
                headers: { 'x-admin-code': codeToUse }
            });
            const result = await res.json();
            if (result.success) setProductList(result.products);
        } catch (err) {
            console.error('Failed to fetch products');
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const productData = {
            name: formData.get('name'),
            category: formData.get('category'),
            description: formData.get('description'),
            image: formData.get('image'),
            features: formData.get('features').split(',').map(f => f.trim()).filter(f => f),
            isFeatured: formData.get('isFeatured') === 'on',
            isNewArrival: formData.get('isNewArrival') === 'on',
        };

        if (editingProduct) productData.id = editingProduct.id;

        try {
            const res = await fetch('/api/admin/products', {
                method: editingProduct ? 'PUT' : 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-admin-code': accessCode
                },
                body: JSON.stringify(productData)
            });
            const result = await res.json();
            if (result.success) {
                setEditingProduct(null);
                setIsAdding(false);
                fetchProducts();
            } else {
                alert('Failed to save product');
            }
        } catch (err) {
            alert('Error saving product');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`/api/admin/products?id=${id}`, {
                method: 'DELETE',
                headers: { 'x-admin-code': accessCode }
            });
            const result = await res.json();
            if (result.success) fetchProducts();
        } catch (err) {
            alert('Error deleting product');
        }
    };

    const getProductName = (id) => {
        const product = productList.find(p => p.id === id);
        return product ? product.name : `Product #${id}`;
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
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Verma's Admin</h1>
                    <nav className={styles.tabs}>
                        <button className={activeTab === 'analytics' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('analytics')}>Analytics</button>
                        <button className={activeTab === 'leads' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('leads')}>Customer Leads</button>
                        <button className={activeTab === 'products' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('products')}>Manage Products</button>
                    </nav>
                </div>
                <button onClick={() => {
                    localStorage.removeItem('verma_admin_code');
                    setIsAuthenticated(false);
                }} className={styles.refreshButton} style={{ backgroundColor: '#ff4444' }}>Logout</button>
            </header>

            {activeTab === 'analytics' && data && (
                <AnalyticsDashboard 
                    data={data} 
                    getMetricValue={getMetricValue} 
                    getProductName={getProductName} 
                    refresh={() => fetchAnalytics()}
                    loading={loading}
                    accessCode={accessCode}
                    hideInternal={hideInternal}
                    setHideInternal={setHideInternal}
                />
            )}

            {activeTab === 'leads' && data && (
                <LeadsDashboard 
                    leads={data.leads || []}
                    getProductName={getProductName}
                    refresh={() => fetchAnalytics()}
                />
            )}

            {activeTab === 'products' && (
                <ProductManager 
                    productList={productList} 
                    onEdit={setEditingProduct}
                    onAdd={() => setIsAdding(true)}
                    onDelete={handleDeleteProduct}
                    editingProduct={editingProduct}
                    isAdding={isAdding}
                    onCancel={() => { setEditingProduct(null); setIsAdding(false); }}
                    onSave={handleSaveProduct}
                    accessCode={accessCode}
                />
            )}
        </div>
    );
}

function AnalyticsDashboard({ data, getMetricValue, getProductName, refresh, loading, accessCode, hideInternal, setHideInternal }) {
    const totalViews = getMetricValue('VIEW');
    const totalClicks = getMetricValue('CLICK');
    const totalInquiries = getMetricValue('INQUIRE');
    const inquiryRate = totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(1) : 0;

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 className={styles.sectionTitle}>Performance Overview</h2>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#666', cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            checked={hideInternal} 
                            onChange={(e) => setHideInternal(e.target.checked)} 
                        />
                        Real Traffic Only (Hide Admin views)
                    </label>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={async () => {
                            const res = await fetch(`/api/analytics?export=csv&hideInternal=${hideInternal}`, { headers: { 'x-admin-code': accessCode } });
                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url; a.download = 'analytics.csv'; a.click();
                        }}
                        className={styles.refreshButton} style={{ backgroundColor: '#4CAF50' }}
                    >Export CSV</button>
                    <button onClick={refresh} className={styles.refreshButton} disabled={loading}>
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Total Views</div>
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
                    <div className={styles.metricLabel}>Inquiry Rate</div>
                    <div className={styles.metricValue}>{inquiryRate}%</div>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Top Viewed Products</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead><tr><th>Product Name</th><th>ID</th><th>Views</th></tr></thead>
                        <tbody>
                            {data.topViewed?.map((item, index) => (
                                <tr key={index}>
                                    <td>{getProductName(item.productId)}</td>
                                    <td>{item.productId}</td>
                                    <td>{item._count.productId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

function LeadsDashboard({ leads, getProductName, refresh }) {
    return (
        <div className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className={styles.sectionTitle}>Recent Customer Inquiries ({leads.length})</h2>
                <button onClick={refresh} className={styles.refreshButton}>Refresh List</button>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead><tr><th>Time</th><th>Product</th><th>Device</th><th>Status</th></tr></thead>
                    <tbody>
                        {leads.length > 0 ? leads.map(lead => {
                            let meta = {};
                            try { meta = JSON.parse(lead.metadata || '{}'); } catch(e) {}
                            return (
                                <tr key={lead.id}>
                                    <td>{new Date(lead.createdAt).toLocaleString()}</td>
                                    <td>
                                        <a href={`/product/${lead.productId}`} target="_blank" style={{ color: '#B57EDC', fontWeight: 600 }}>{getProductName(lead.productId)}</a>
                                    </td>
                                    <td>{meta.device || 'Unknown'}</td>
                                    <td><span style={{ color: '#4CAF50', fontWeight: 600 }}>WhatsApp Click</span></td>
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No inquiries yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ProductManager({ productList, onEdit, onAdd, onDelete, editingProduct, isAdding, onCancel, onSave, accessCode }) {
    const product = editingProduct || {};
    const [imagePreview, setImagePreview] = useState(product.image || '');
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: { 'x-admin-code': accessCode },
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                setImagePreview(result.url);
                const imageInput = document.querySelector('input[name="image"]');
                if (imageInput) imageInput.value = result.url;
            } else {
                alert('Upload failed.');
            }
        } catch (err) {
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };
    
    if (editingProduct || isAdding) {
        return (
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{isAdding ? 'Add New Product' : 'Edit Product'}</h2>
                <form onSubmit={onSave} className={styles.productForm}>
                    <div className={styles.formGroup}><label>Product Name</label><input name="name" defaultValue={product.name} required /></div>
                    <div className={styles.formGroup}><label>Category</label>
                        <select name="category" defaultValue={product.category || 'Sofas'}>
                            <option>Sofas</option><option>Dining</option><option>Chairs</option><option>Ottomans</option><option>Headboards</option><option>Tables</option><option>Curtains</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}><label>Description</label><textarea name="description" defaultValue={product.description} rows="4" required /></div>
                    <div className={styles.formGroup}><label>Product Image</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />}
                            <div style={{ flex: 1 }}>
                                <input type="file" accept="image/*" onChange={handleImageUpload} />
                                {uploading && <p style={{ fontSize: '0.8rem', color: '#B57EDC' }}>Uploading...</p>}
                                <input type="hidden" name="image" defaultValue={imagePreview} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.formGroup}><label>Features (Comma separated)</label><input name="features" defaultValue={product.features?.join(', ')} /></div>
                    <div style={{ display: 'flex', gap: '2rem', margin: '1rem 0' }}>
                        <label><input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} /> Featured</label>
                        <label><input type="checkbox" name="isNewArrival" defaultChecked={product.isNewArrival} /> New Arrival</label>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="submit" className={styles.refreshButton}>Save Product</button>
                        <button type="button" onClick={onCancel} className={styles.refreshButton} style={{ backgroundColor: '#666' }}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className={styles.sectionTitle}>Product Inventory ({productList.length})</h2>
                <button onClick={onAdd} className={styles.refreshButton}>+ Add New Product</button>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Actions</th></tr></thead>
                    <tbody>
                        {productList.map(p => (
                            <tr key={p.id}>
                                <td><img src={p.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                                <td>{p.name}</td><td>{p.category}</td>
                                <td>
                                    <button onClick={() => onEdit(p)} style={{ marginRight: '10px', color: '#B57EDC', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => onDelete(p.id)} style={{ color: '#ff4444', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
