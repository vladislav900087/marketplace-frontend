import { useCart } from '../hooks/useCart';
import { useState } from 'react';
import { getSessionFromToken } from '../utilities/tokenDecoder';
import api from '../api/axios';
import type { Order } from '../types/order';

export default function CartPage() {
    const currentUser = getSessionFromToken();
    const isAdmin = currentUser.role === 'admin';

    const [usernameInput, setUsernameInput] = useState('');
    const [submittedTarget, setSubmittedTarget] = useState<string | undefined>(undefined);

    // order memory cell
    const [order, setOrder] = useState<Order | null>(null);
    const [orderCreateLoading, setOrderCreateLoading] = useState(false);

    const handleAdminSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittedTarget(usernameInput.trim() || undefined);
    }

    const handleCreateOrder = async () => {
        try {
            setOrderCreateLoading(true);
            const response = await api.post<Order>('/orders/add');
            setOrder(response.data);

            if (response.data?.id) {
                navigate(`/order/${response.data.id}`);
            }
        } catch (err: any) {
            // Added safe error handling logic (fallback to setError string or alert if no layout placeholder is wired up)
            alert(err.response?.data?.detail || 'Failed to create order.');
        } finally {
            setOrderCreateLoading(false);
        }
    };

    const {
        cart,
        loading,
        error,
        navigate,
        canManageCart,
        cartOwner,
        handleRemoveItem,
        handleClearCart
    } = useCart(submittedTarget);

    if (loading) {
        return <div className="center-status-text">Loading shopping cart...</div>;
    }

    return (
        <div className="page-container">
            {/* ADMIN LOOKUP CONTROLS */}
            {isAdmin && (
                <form onSubmit={handleAdminSearch} className="admin-lookup-form">
                    <label className="admin-lookup-label">
                        Admin Tool: Inspect User Cart
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            placeholder="Enter owner_username (Leave empty for your own cart)..."
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
                        Currently inspecting: <strong>{cartOwner || 'Your Own Cart'}</strong>
                    </p>
                </form>
            )}

            {/* CART HEADER ROW */}
            <div className="cart-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className="page-heading" style={{ margin: 0 }}>
                    {submittedTarget ? `${cartOwner}'s Cart` : 'Your Shopping Cart'}
                </h2>

                {canManageCart && cart && cart.items.length > 0 && (
                    <button
                        onClick={handleClearCart}
                        className="clear-cart-btn"
                        style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                    >
                        Clear Cart
                    </button>
                )}
            </div>

            {/* ERROR DISPLAY */}
            {error && <div className="center-status-text" style={{ color: '#dc2626', marginBottom: '16px' }}>{error}</div>}

            {/* MAIN CONDITIONAL LAYOUT */}
            {!cart || cart.items.length === 0 ? (
                <div className="empty-state-wrapper">
                    <h3 className="empty-state-title">This cart is empty</h3>
                    <p className="empty-state-subtext" style={{ marginBottom: '20px' }}>No items found inside this active record context.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="add-to-cart-btn"
                        style={{ display: 'inline-block', padding: '10px 20px', textDecoration: 'none', textAlign: 'center', maxWidth: '200px', margin: '0 auto' }}
                    >
                        Go to Marketplace
                    </button>
                </div>
            ) : (
                <div className="cart-content-layout">
                    {/* ITEMS LIST */}
                    <div className="cart-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                        {cart.items.map((item) => (
                            <div className="product-card" key={item.product_id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '16px', transform: 'none', boxShadow: 'none' }}>
                                <div className="item-details-block">
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--text-main)' }}>{item.title}</h4>
                                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
                                        ${item.price.toFixed(2)} x {item.quantity}
                                    </p>
                                </div>

                                <div className="item-actions-block" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)' }}>
                                        ${item.subtotal.toFixed(2)}
                                    </span>

                                    {canManageCart && (
                                        <button
                                            onClick={() => handleRemoveItem(item.product_id)}
                                            className="remove-item-btn"
                                            style={{ background: 'none', color: '#dc2626', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SUMMARY CARD */}
                    <div className="product-card" style={{ padding: '20px', marginTop: '30px', transform: 'none', boxShadow: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>Total Order Price:</span>
                            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary-color)' }}>
                                ${cart.total_price.toFixed(2)}
                            </span>
                        </div>
                        <button
                            onClick={() => handleCreateOrder()}
                            disabled={orderCreateLoading}
                            className="add-to-cart-btn"
                            style={{ width: '100%', padding: '12px', fontSize: '16px', fontWeight: 700 }}
                        >
                            {orderCreateLoading ? 'Processing Checkout...' : 'Proceed to Checkout'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}