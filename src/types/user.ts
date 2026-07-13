


export interface User {
    id: number
    username: string
    email: string
    role: string
    updated_at: string

    }

export interface UserSession {

    username: string;
    role: 'admin' | 'user';

    }
