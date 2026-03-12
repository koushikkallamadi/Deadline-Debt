import api from './api';

const USER_KEY = 'debt_user';

const authService = {
    // Register user
    register: async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        const data = response.data;
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        if (data.user) {
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        }
        return data;
    },

    // Login user
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const data = response.data;
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        if (data.user) {
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        }
        return data;
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem(USER_KEY);
    },

    // Get current token
    getToken: () => localStorage.getItem('token'),

    // Get stored user info
    getUser: () => {
        try {
            const raw = localStorage.getItem(USER_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }
};

export default authService;
