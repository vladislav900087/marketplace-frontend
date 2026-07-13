interface JWTPayload {
    sub?: string;
    role?: 'admin' | 'user';
}

export const getSessionFromToken = (): { username: string; role: 'admin' | 'user' } => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { username: '', role: 'user' };

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const decoded: JWTPayload = JSON.parse(jsonPayload);
        return {
            username: decoded.sub || '',
            role: decoded.role || 'user'
        };
    } catch (err) {
        return { username: '', role: 'user' };
    }
};