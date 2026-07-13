import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Order } from '../types/order';

export default function OrderDetailsPage() {
    const [lastOrder, setLastOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleGetLastOrder = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get<{ items: Order[] }>('/orders/');
            const items = response.data.items;

            if (items && items.length > 0) {
                setLastOrder(items[items.length - 1]);
            }
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            setError(Array.isArray(detail) ? detail[0].msg || 'Validation error' : detail || 'Failed to load your current order.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOrder = async (action: 'pay' | 'cancel') => {
        if (!lastOrder) return;
        try {
            await api.post('/orders/confirm', {
                order_id: lastOrder.id,
                action: action
            });
            alert(`Your order has been ${action === 'pay' ? 'paid' : 'cancelled'}`);
            navigate('/orders');
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            alert(Array.isArray(detail) ? detail[0].msg || 'Validation error' : detail || 'Failed to confirm your current order.');
        }
    };

    useEffect(() => {
        handleGetLastOrder();
    }, []);

    if (loading) return <div className="center-status-text">Loading order details...</div>;
    if (error) return <div className="center-status-text error-text">{error}</div>;

    return (
        <div className="page-container">
            <h2 className="page-heading">Order Checkout Details</h2>
            {!lastOrder ? (
                <div className="empty-state-wrapper">
                    <h3 className="empty-state-title">No Active Order Found</h3>
                    <p className="empty-state-subtext">Go back to the marketplace to start adding items.</p>
                </div>
            ) : (
                <div className="order-details-card">
                    <div className="order-detail-header">
                        <h3>Order Context Summary</h3>
                        <span className={`status-badge status-${lastOrder.status.toLowerCase()}`}>
                            {lastOrder.status}
                        </span>
                    </div>
                    <div className="order-meta-info">
                        <p><strong>Order Identification Hash:</strong> #{lastOrder.id}</p>
                        <p><strong>Created Timestamp:</strong> {new Date(lastOrder.created_at).toLocaleString()}</p>
                    </div>
                    <div className="order-price-summary">
                        <span>Amount Due to Settle:</span>
                        <span className="price-amount">${lastOrder.total_price.toFixed(2)}</span>
                    </div>

                    {lastOrder.status.toLowerCase() === 'pending' && (
                        <div className="order-actions-row">
                            <button
                                onClick={() => handleConfirmOrder('cancel')}
                                className="order-btn-secondary"
                            >
                                Cancel Order Registration
                            </button>
                            <button
                                onClick={() => handleConfirmOrder('pay')}
                                className="order-btn-primary"
                            >
                                Transact Payment Now
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}