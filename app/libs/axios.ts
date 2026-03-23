import Axios from 'axios';

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
});

axios.interceptors.request.use(
    (config) => {
        // Only run this on the client side (browser)
        if (typeof window !== 'undefined') {
            // IMPORTANT: Change 'auth_token' to whatever key you used when saving it during login!
            const token = localStorage.getItem('auth_token'); 
            
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            
            delete axios.defaults.headers.common['Authorization'];
            
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axios;