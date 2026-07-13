import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Product } from '../types/product';


export default function ProductDetailsPage() {

    // extracts product id from the active url string

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();


    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    // separated business logic engines


    const loadSingleProductRecord = async () => {

        try {

            setLoading(true);

            // fetch specific item using the url parameter

            const response = await api.get<Product>(`products/${id}`);
            setProduct(response.data);

            } catch (err: any) {

                setError('Could not retrieve any information about this product');

                } finally {
                    setLoading(false);

                    }



        };


    useEffect(() => {
        if (id) {

            loadSingleProductRecord();

            }

        }, [id]); // reloads if id variable changes


    if (loading) return <div className="center-status-text">Opening details panel...</div>;
    if (error) return <div className="center-status-text" style={{ color: '#dc2626'}}>{ error }</div>;
    if (!product) return <div className="center-status-text">Product record not found.</div>;


    const currencySymbols: Record<string, string> = { dollar: '$', rouble: '₽', tenge: '₸'};
    const symbol = currencySymbols[product.currency] || '$';


    return (
        <div className="page-container" style={{ maxWidth: '800px' }}>
            {/* navigates back one step in browser history structure */}
            <button onClick={() => navigate(-1)} className="view-details-btn" style={{ maxWidth: '160px', marginBottom: '20px' }}>
                ← Back to Catalog
            </button>

            <div className="product-card" style={{ cursor: 'default' }}>
                <div className="card-content">
                    <h1 className="page-heading" style={{ marginBottom: '10px' }}>{product.title}</h1>
                    <p className="product-card-price" style={{ fontSize: '28px', marginBottom: '24px' }}>
                        {symbol}{product.price.toFixed(2)}
                    </p>

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                        <h4 style={{ color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                            Description
                        </h4>
                        <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '16px' }}>
                            {product.description || 'No description provided by the vendor for this inventory listing.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );





    }