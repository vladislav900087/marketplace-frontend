import { useState, useEffect } from 'react';
import api from '../api/axios';
import type { Order } from '../types/order';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadUserOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get<{ items: Order[] }>('/orders/');
            setOrders(response.data.items);
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            setError(Array.isArray(detail) ? detail[0].msg || 'Validation error' : detail || 'Failed to load your orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserOrders();
    }, []);

    return (
        <div className="page-container">
            <h2 className="page-heading">Your Order Records History</h2>
            {loading ? (
                <div className="center-status-text">Loading account histories...</div>
            ) : error ? (
                <div className="center-status-text error-text">{error}</div>
            ) : orders.length === 0 ? (
                <div className="empty-state-wrapper">
                    <h3 className="empty-state-title">No historical orders found</h3>
                    <p className="empty-state-subtext">Orders you complete in the future will appear inside this log matrix.</p>
                </div>
            ) : (
                <div className="orders-grid-layout">
                    {orders.map((order) => (
                        <div className="order-record-item-card" key={order.id}>
                            <div className="card-top-row">
                                <span className="order-id-label">Record #{order.id}</span>
                                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="card-middle-row">
                                <p className="order-timestamp">{new Date(order.created_at).toLocaleString()}</p>
                            </div>
                            <div className="card-bottom-row">
                                <span className="order-price-label">Settle Value:</span>
                                <span className="order-price-val">${order.total_price.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}