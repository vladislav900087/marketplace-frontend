import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';



interface ProfileData {
    id: number;
    username: string;
    role: string;
    email: string;
    updated_at: string;


    }


export default function ProfilePage() {
    // states and utils
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // memory cells
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');




    const handleGetUserData = async () => {

        try {

            setLoading(true);
            setError('');

            const response = await api.get<ProfileData>('/profile/');
            setUsername(response.data.username);
            setRole(response.data.role);
            setEmail(response.data.email);

            } catch (err: any) {

                const detail = err.response?.data?.detail;
                setError(Array.isArray(detail) ? detail[0].msg || 'Validation error' : detail || 'Failed to load your profile');

                if (err.response?.status === 401 || err.response?.status === 404) {

                    localStorage.removeItem('token');
                    setTimeout(() => navigate('/login'), 2000);

                    }

                } finally {

                    setLoading(false);

                    }




        };


    useEffect(() => {

        handleGetUserData();

        }, []);

    if (loading) {
        return <div className="center-status-text">Loading profile credentials...</div>;
    }

    return (
        <div className="page-container" style={{ maxWidth: '600px' }}>
            <h2 className="page-heading">Your Profile</h2>

            {error && <div className="center-status-text" style={{ color: '#dc2626', marginBottom: '16px' }}>{error}</div>}

            <div className="order-details-card">
                <div className="order-detail-header">
                    <h3>Account Credentials</h3>
                    <span className={`status-badge ${role === 'admin' ? 'status-cancelled' : 'status-paid'}`}>
                        {role}
                    </span>
                </div>

                <div className="order-meta-info" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Username handle
                        </label>
                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>
                            {username || 'N/A'}
                        </p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Registered Email address
                        </label>
                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>
                            {email || 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="order-actions-row" style={{ marginTop: '32px' }}>

                    <button
                        onClick={() => navigate('/profile/update')}
                        className="add-to-cart-btn"
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        Edit profile
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="add-to-cart-btn"
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        Return to Marketplace
                    </button>
                </div>
            </div>
        </div>
    );

    }