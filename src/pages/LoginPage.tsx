import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const data = await authService.login({ username, password });
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                navigate('/');
            } else {
                setError('Token was missing from server response.');
            }
        } catch (err: any) {
            const backendError = err.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(backendError[0]?.msg || 'Validation error');
            } else {
                setError(backendError || 'Invalid username or password');
            }
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Login</h2>
            {error && <div className="auth-error-msg">{error}</div>}

            <form onSubmit={handleLogin} className="auth-form">
                <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                <button type='submit' className="auth-submit-btn">Sign In</button>
            </form>
        </div>
    );
}