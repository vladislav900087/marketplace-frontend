import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const [isDarkMode, setIsDarkMode] = useState(() => {

        return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

        })


    useEffect(() => {

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');

            } else {

                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');


                }

        }, [isDarkMode])

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="main-navbar">
            <div>
                <Link to='/' className="nav-logo">Ponomaryov's marketplace</Link>
            </div>

            <div className="nav-links-wrapper">
                {isAuthenticated ? (
                    <>
                        <Link to='/products' className="nav-item-link">Products</Link>
                        <Link to='/orders' className="nav-item-link">Orders</Link>
                        <Link to='/cart' className="nav-item-link">Cart</Link>
                        <Link to='/profile' className="nav-item-link">Profile</Link>
                        <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to='/login' className="nav-item-link">Login</Link>
                        <Link to='/register' className="nav-register-btn">Sign Up</Link>
                    </>
                )}

                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    style={{
                        padding: '8px 14px',
                        backgroundColor: isDarkMode ? '#334155' : '#f1f5f9',
                        color: isDarkMode ? '#f8fafc' : '#1e293b',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '13px',
                        marginLeft: '8px'
                    }}
                >
                    {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                </button>
            </div>
        </nav>
    );
}