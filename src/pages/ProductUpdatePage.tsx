import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import type {Product, ProductUpdateProps } from '../types/product';
import { getSessionFromToken } from '../utilities/tokenDecoder';




export default function ProductUpdatePage() {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const currentUser = getSessionFromToken();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);


    const [formData, setFormData] = useState<ProductUpdateProps>(
        {
            owner_username: currentUser?.username || '',
            new_title: '',
            new_description: '',
            new_price: 0,
            new_currency: 'USD'


            }

        );

    const fetchProductDetails = async () => {

        try {
            setLoading(true);
            setError('');
            const response = await api.get<Product>(`/products/${id}`);
            setProduct(response.data);

            setFormData({
                owner_username: currentUser?.username || '',
                new_title: response.data.title,
                new_description: response.data.description || '',
                new_price: response.data.price,
                new_currency: response.data.currency || 'USD'

                });

            } catch (err: any) {

                const detail = err.response?.data?.detail;
                setError(Array.isArray(detail) ? detail[0].msg || 'Validation error' : detail || 'Failed to load product details. Try again later.')

                } finally {

                    setLoading(false);

                    }


        };


    useEffect(() => {

        if (!id) return;

        fetchProductDetails();



        }, [id, navigate, currentUser?.username]);


    const handleFormSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        if (!id || !product) return;

        if (!formData.new_title?.trim() || (formData.new_price !== undefined && formData.new_price <= 0)) {

            alert('Please, provide a valid title and price value');
            return;

            }

        try {

            setUpdating(true);
            await api.put(`/products/${encodeURIComponent(id)}`, formData);
            alert('Product configured and updated successfully!');
            navigate('/products');

            } catch (err: any) {

                const detail = err.response?.data?.detail;
                const errMsg = Array.isArray(detail) ? detail.map(e => e.msg).join(', ') : (detail || 'Failed to update this product');
                alert(`Error updating item: ${errMsg}`);


                } finally {

                    setUpdating(false);

                    }


        };


    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading context values...</div>;
    }

    if (error || !product) {
        return (
            <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '24px' }}>
                <div style={{ color: '#dc2626', fontWeight: 600, marginBottom: '16px' }}>{error || 'Product record not found.'}</div>
                <button onClick={() => navigate('/products')} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    Return to Inventory
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, color: '#0f172a' }}>Update Product #{id}</h2>
                <button
                    type="button"
                    onClick={() => navigate('/products')}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 600 }}
                >
                    Cancel
                </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>

                {/* Product Title Field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Product Title</label>
                    <input
                        type="text"
                        value={formData.new_title}
                        onChange={(e) => setFormData({ ...formData, new_title: e.target.value })}
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                        required
                    />
                </div>

                {/* pricing and currency grid row */}
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Price</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.new_price ?? ''}
                            onChange={(e) => setFormData({ ...formData, new_price: parseFloat(e.target.value) || 0 })}
                            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '15px', width: '100%', boxSizing: 'border-box' }}
                            required
                        />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Currency</label>
                        <select
                            value={formData.new_currency}
                            onChange={(e) => setFormData({ ...formData, new_currency: e.target.value })}
                            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '15px', height: '40px' }}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </div>
                </div>

                {/* optional product description field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Description Details</label>
                    <textarea
                        value={formData.new_description}
                        onChange={(e) => setFormData({ ...formData, new_description: e.target.value })}
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '15px', minHeight: '100px', resize: 'vertical' }}
                    />
                </div>

                {/* form action submit control buttons */}
                <button
                    type="submit"
                    disabled={updating}
                    style={{
                        backgroundColor: updating ? '#93c5fd' : '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '16px',
                        cursor: updating ? 'not-allowed' : 'pointer',
                        marginTop: '10px',
                        transition: 'background-color 0.2s'
                    }}
                >
                    {updating ? 'Saving Configuration Changes...' : 'Save Product Updates'}
                </button>
            </form>
        </div>
    );









    }