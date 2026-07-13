import api from '../api/axios';



interface RegisterPayload {

    username: string;
    role: string;
    email: string;
    password: string;

    }


interface LoginPayload {
    username: string;
    password: string;

    }

interface LoginResponse {
    access_token: string;
    token_type: string;

    }

// container with auth function
export const authService = {
    // sends json to the fastapi route
    async register(credentials: RegisterPayload): Promise<void> {

        await api.post('/register', credentials);

        },

    // converts credentials into a standard url form required by FastAPI

    async login(credentials: LoginPayload): Promise<LoginResponse> {

        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await api.post<LoginResponse>('/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

        return response.data;

        },

    // removes the token from the browser storage to log out

    logout() {
        localStorage.removeItem('token')

        },

    };