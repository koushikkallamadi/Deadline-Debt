import axios from 'axios';

// Uses VITE_API_URL from .env — falls back to the deployed backend
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://deadline-debt.onrender.com/api',
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Adjust if your backend expects a different format like 'x-auth-token'
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle globally (e.g., token expiration, 401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login if necessary
            // localStorage.removeItem('token');
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;
