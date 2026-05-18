'use client';

import { useEffect, useState } from 'react';
import styles from './import.module.css';

export default function BulkImportPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productFeatures, setProductFeatures] = useState('Premium Materials, Handcrafted, Custom Sizing Available');
    const [category, setCategory] = useState('Sofas');
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importedProducts, setImportedProducts] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const savedCode = localStorage.getItem('verma_admin_code');
        if (savedCode) {
            setAccessCode(savedCode);
            setIsAuthenticated(true);
            loadImages(savedCode);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        localStorage.setItem('verma_admin_code', accessCode);
        setIsAuthenticated(true);
        loadImages(accessCode);
    };

    const loadImages = async (code) => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/local-images', {
                headers: { 'x-admin-code': code }
            });
            const data = await res.json();
            if (data.success) {
                setImages(data.files);
            } else {
                setError('Failed to load images');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const toggleImageSelection = (filename) => {
        setSelectedImages(prev => {
            if (prev.includes(filename)) {
                return prev.filter(f => f !== filename);
            }
            if (prev.length >= 4) {
                setError('Maximum 4 images per product');
                return prev;
            }
            setError('');
            return [...prev, filename];
        });
    };

    const handleImport = async () => {
        if (selectedImages.length === 0) {
            setError('Please select at least 1 image');
            return;
        }
        if (!productName.trim()) {
            setError('Please enter a product name');
            return;
        }

        setImporting(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/admin/bulk-import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-code': accessCode
                },
                body: JSON.stringify({
                    name: productName,
                    category,
                    description: productDescription || `Premium handcrafted ${productName} from Verma's Furnishing.`,
                    features: productFeatures.split(',').map(f => f.trim()).filter(f => f),
                    filenames: selectedImages,
                })
            });
            const data = await res.json();

            if (data.success) {
                setSuccess(`✅ "${data.product.name}" created successfully with ${data.product.images.length} images!`);
                setImportedProducts(prev => [...prev, data.product]);

                // Remove imported images from the grid
                setImages(prev => prev.filter(f => !selectedImages.includes(f)));
                setSelectedImages([]);
                setProductName('');
                setProductDescription('');
            } else {
                setError('Import failed: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            setError('Import failed: ' + err.message);
        } finally {
            setImporting(false);
        }
    };

    const getImageUrl = (filename) => {
        return `/api/admin/local-image/${encodeURIComponent(filename)}?code=${encodeURIComponent(accessCode)}`;
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className={styles.loginBox}>
                    <h1>Bulk Import</h1>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Enter Access Code"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            className={styles.input}
                        />
                        <button type="submit" className={styles.btnPrimary}>Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Bulk Product Import</h1>
                    <p className={styles.subtitle}>
                        {images.length} images remaining • {importedProducts.length} products created
                    </p>
                </div>
                <a href="/admin" className={styles.btnSecondary}>← Back to Admin</a>
            </header>

            {/* Product Form Panel */}
            <div className={styles.formPanel}>
                <h2>Product Details</h2>
                <p className={styles.hint}>
                    👇 Click images below to select them, then fill in the details and hit Create.
                </p>

                {selectedImages.length > 0 && (
                    <div className={styles.selectedPreview}>
                        {selectedImages.map((filename, i) => (
                            <div key={filename} className={styles.previewThumb}>
                                <img src={getImageUrl(filename)} alt={`Selected ${i + 1}`} />
                                <button
                                    onClick={() => toggleImageSelection(filename)}
                                    className={styles.removeBtn}
                                >✕</button>
                                <span className={styles.previewLabel}>
                                    {i === 0 ? 'Primary' : `Image ${i + 1}`}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label>Product Name *</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="e.g. Royal Tufted Velvet Sofa"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.input}>
                            <option>Sofas</option>
                            <option>Dining</option>
                            <option>Chairs</option>
                            <option>Ottomans</option>
                            <option>Headboards</option>
                            <option>Tables</option>
                            <option>Curtains</option>
                        </select>
                    </div>
                    <div className={styles.formGroupFull}>
                        <label>Description (optional)</label>
                        <textarea
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            placeholder="Leave empty for auto-generated description"
                            rows={2}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroupFull}>
                        <label>Features (comma separated)</label>
                        <input
                            type="text"
                            value={productFeatures}
                            onChange={(e) => setProductFeatures(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button
                        onClick={handleImport}
                        disabled={importing || selectedImages.length === 0 || !productName.trim()}
                        className={styles.btnPrimary}
                    >
                        {importing ? 'Uploading & Creating...' : `Create Product (${selectedImages.length} image${selectedImages.length !== 1 ? 's' : ''})`}
                    </button>
                    {selectedImages.length > 0 && (
                        <button
                            onClick={() => setSelectedImages([])}
                            className={styles.btnSecondary}
                        >
                            Clear Selection
                        </button>
                    )}
                </div>

                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
            </div>

            {/* Image Grid */}
            {loading ? (
                <div className={styles.loading}>Loading images...</div>
            ) : (
                <div className={styles.imageGrid}>
                    {images.map((filename) => {
                        const isSelected = selectedImages.includes(filename);
                        const selectionIndex = selectedImages.indexOf(filename);
                        return (
                            <div
                                key={filename}
                                className={`${styles.imageCard} ${isSelected ? styles.selected : ''}`}
                                onClick={() => toggleImageSelection(filename)}
                            >
                                <img
                                    src={getImageUrl(filename)}
                                    alt={filename}
                                    loading="lazy"
                                />
                                {isSelected && (
                                    <div className={styles.selectedBadge}>
                                        {selectionIndex + 1}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Imported Products Log */}
            {importedProducts.length > 0 && (
                <div className={styles.importLog}>
                    <h3>Created Products</h3>
                    {importedProducts.map((p, i) => (
                        <div key={i} className={styles.logItem}>
                            ✅ {p.name} — {p.images.length} images — <a href={`/product/${p.id}`} target="_blank">View</a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
