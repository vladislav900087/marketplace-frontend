import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { User } from '../types/user';


interface ProfileUpdateProps {

    id: number;
    new_username?: string;
    email?: string;


    }

export default function ProductUpdatePage() {


    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState<ProfileUpdateProps>(
        {
            id: null,
            new_username: '',
            email: ''

            }


        );


    const handleGetCurrentUser = async () => {

        try {

            setLoading(true);
            setError('');

            const response = await api.get('/me');
            setCurrentUser(response.data);

            setFormData({
                id: response.data.id,
                new_username: response.data.username || '',
                email: response.data.email || '',

                });



            } catch (err: any) {

                const detail = err.response?.data?.detail;
                setError(Array.isArray(detail) ? detail[0].msg || 'Validation error' : detail || 'Failed to load current user data');

                if (err.response?.status === 401 || err.response?.status === 404) {

                    localStorage.removeItem(token);
                    setTimeout(() => navigate('/login'), 2000);


                    };


                } finally {

                    setLoading(false);

                    }



        };


    const handleFormSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!formData.new_username.trim()) {

            alert('Please, provide at least a new username');
            return;

            }

        try {

            setUpdating(true);
            await api.post('/profile/update', formData);
            alert('Profile configured and updated successfully!');
            setNewUsername(formData.new_username);
            setNewEmail(formData.email);
            navigate('/profile');


            } catch (err: any) {

                const detail = err.response?.data?.detail;
                const errMsg = Array.isArray(detail) ? detail.map(e => e.msg).join(', ') : (detail || 'Failed to update your profile');
                setError(errMsg);

                } finally {

                    setUpdating(false);

                    }

        };


    useEffect(() => {

        handleGetCurrentUser()

        }, [newUsername, newEmail]);


    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading context values...</div>;

        }

    if (error) {

        return (
            <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '24px' }}>
                <div style={{ color: '#dc2626', fontWeight: 600, marginBottom: '16px' }}>{error || 'User not found.'}</div>
                <button onClick={() => navigate('/profile')} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    Return to Profile
                </button>
            </div>
            );


        }

    return (
        <div className="page-container" style={{ maxWidth: '500px' }}>
            <h2 className="page-heading">Update Profile Settings</h2>

            <div className="auth-container" style={{ maxWidth: '100%', margin: '0' }}>
                <h3 className="auth-title" style={{ fontSize: '18px', marginBottom: '16px' }}>Edit Configurations</h3>

                <form onSubmit={handleFormSubmit} className="auth-form">
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                            Username Handle
                        </label>
                        <input
                            type="text"
                            placeholder="New username..."
                            value={formData.new_username}
                            onChange={(e) => setFormData({ ...formData, new_username: e.target.value })}
                            className="auth-input"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="New email address..."
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="auth-input"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        <button
                            type="submit"
                            disabled={updating}
                            className="auth-submit-btn"
                            style={{ flex: 1, margin: 0 }}
                        >
                            {updating ? 'Saving Changes...' : 'Save Profile'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="view-details-btn"
                            style={{ flex: 1, padding: '12px 0', borderRadius: '8px' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );




    }