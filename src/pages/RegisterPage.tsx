import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await authService.register({ username, role, email, password });
            navigate('/login');
        } catch (err: any) {
            const backendError = err.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(backendError[0]?.msg || 'Validation error');
            } else {
                setError(backendError || 'Invalid registration details');
            }
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Sign Up</h2>
            {error && <div className="auth-error-msg">{error}</div>}

            <form onSubmit={handleRegister} className="auth-form">
                <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="auth-input"
                    required
                />
                <input
                    type='text'
                    placeholder='Role'
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="auth-input"
                    required
                />
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    required
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                    required
                />
                <button type='submit' className="auth-submit-btn">Sign Up</button>
            </form>
        </div>
    );
}