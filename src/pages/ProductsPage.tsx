import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

import type { Product, ProductProps } from '../types/product'
import { getSessionFromToken } from '../utilities/tokenDecoder';

export default function ProductsPage() {
    const currentUser = getSessionFromToken()
    const isAdmin = currentUser.role === 'admin';

    // memory cells
    const [usernameInput, setUsernameInput] = useState('');
    const [submittedTarget, setSubmittedTarget] = useState<string | undefined>(undefined);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // user permissions
    const activeCartOwner = submittedTarget || currentUser.username;
    const canManageCart = currentUser.role === 'admin' || currentUser.username === activeCartOwner;

    // form input states
    const [newProduct, setNewProduct] = useState<ProductProps>({
        title: '',
        description: '',
        price: 0,
        currency: 'USD'
    });

    // business logic
    const handleAdminSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittedTarget(usernameInput.trim() || undefined);
    }

    const loadUserInventory = async () => {
        try {
            setLoading(true);
            setError('');
            setProducts([]);

            const url = currentUser.username !== activeCartOwner ? `/other_products/${encodeURIComponent(activeCartOwner)}` : '/products';
            const response = await api.get<Product[]>(url);
            setProducts(response.data);
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            setError(Array.isArray(detail) ? detail[0]?.msg || 'Validation error' : detail || 'Failed to load your personal inventory products.');
        } finally {
            setLoading(false);
        }
    };

    const handleProductAdd = async (data: ProductProps) => {
        try {
            await api.post('/products', data);
            setNewProduct({title: '', description: '', price: 0, currency: 'USD'});
            loadUserInventory();
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            alert(Array.isArray(detail) ? detail[0]?.msg || 'Validation error' : detail || 'Failed to add product');
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProduct.title || newProduct.price <= 0) {
            alert('Please, provide a valid title and price');
            return;
        }
        await handleProductAdd(newProduct);
    }

    const handleProductDelete = async (productId: number) => {
        try {
            await api.delete(`/products/${encodeURIComponent(productId)}`, {
                data: {
                    owner_username: activeCartOwner
                }
            })
            loadUserInventory();
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            alert(Array.isArray(detail) ? detail[0]?.msg || 'Validation error' : detail || 'Failed to delete the product');
        }
    };

    // load them on load immediately
    useEffect(() => {
        loadUserInventory();
    }, [activeCartOwner]);

    return (
        <div className="page-container">

            {/* ADMIN SEARCH BAR CONTROLS */}
            {isAdmin && (
                <form onSubmit={handleAdminSearch} className="admin-lookup-form">
                    <label className="admin-lookup-label">
                        Admin Tool: Inspect User Inventory
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            placeholder="Enter owner_username (Leave empty for your own inventory)..."
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            className="auth-input"
                            style={{ flex: 1, padding: '10px', fontSize: '14px' }}
                        />
                        <button
                            type="submit"
                            style={{ padding: '0 16px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Inspect
                        </button>
                    </div>
                    <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: 'var(--admin-text)' }}>
                        Currently inspecting inventory of: <strong>{activeCartOwner}</strong>
                    </p>
                </form>
            )}

            {/* NEW PRODUCT CREATION FORM BLOCK */}
            {canManageCart && (
                <div className="auth-container" style={{ maxWidth: '100%', margin: '0 0 32px 0', padding: '20px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-main)' }}>Add New Product to Context</h3>
                    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                placeholder="Product Title..."
                                value={newProduct.title}
                                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                                className="auth-input"
                                style={{ flex: 2, minWidth: '200px', padding: '10px' }}
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Price..."
                                value={newProduct.price || ''}
                                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                                className="auth-input"
                                style={{ flex: 1, minWidth: '100px', padding: '10px' }}
                            />
                            <select
                                value={newProduct.currency}
                                onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value })}
                                className="auth-input"
                                style={{ width: '90px', padding: '10px' }}
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                            </select>
                        </div>
                        <textarea
                            placeholder="Optional product description details..."
                            value={newProduct.description || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="auth-input"
                            style={{ width: '100%', padding: '10px', minHeight: '60px', resize: 'vertical' }}
                        />
                        <button
                            type="submit"
                            className="auth-submit-btn"
                            style={{ margin: 0, padding: '10px 20px', alignSelf: 'flex-start' }}
                        >
                            List Product
                        </button>
                    </form>
                </div>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '24px' }} />

            {/* DYNAMIC CONTENT LAYOUTS */}
            <h2 className="page-heading" style={{ margin: '0 0 20px 0' }}>
                {submittedTarget ? `${activeCartOwner}'s Listed Products` : 'Your Listed Products'}
            </h2>

            {loading ? (
                <div className="center-status-text">Loading inventory...</div>
            ) : error ? (
                <div className="center-status-text" style={{ color: '#dc2626' }}>{error}</div>
            ) : products.length === 0 ? (
                <div className="empty-state-wrapper">
                    <h3 className="empty-state-title">No items listed inside this inventory</h3>
                    <p className="empty-state-subtext">When products are added to this inventory, they will render here.</p>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <div className="product-card" key={product.id} style={{ padding: '16px' }}>
                            <div className="card-content">
                                <h3 className="product-card-title" style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{product.title}</h3>
                                {product.description && <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>{product.description}</p>}
                                <p className="product-card-price" style={{ fontSize: '16px', margin: 0 }}>
                                    {product.currency === 'USD' ? '$' : ''}{product.price.toFixed(2)} {product.currency !== 'USD' ? product.currency : ''}
                                </p>
                            </div>

                            {canManageCart && (
                                <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/update_product/${product.id}`)}
                                        style={{ background: 'none', color: 'var(--primary-color)', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '14px', padding: 0, marginRight: 'auto' }}
                                    >
                                        Update Item
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleProductDelete(product.id)}
                                        style={{ background: 'none', color: '#dc2626', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '14px', padding: 0 }}
                                    >
                                        Delete Item
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
