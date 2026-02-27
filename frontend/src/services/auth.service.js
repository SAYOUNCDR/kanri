import api, { setAccessToken } from './api';

export const authService = {
    // Login standard user or admin
    login: async (email, password) => {
        const response = await api.post('/users/login', { email, password });
        if (response.data.accessToken) {
            setAccessToken(response.data.accessToken);
        }
        return response.data;
    },

    // Logout (clears HttpOnly cookie on backend)
    logout: async () => {
        await api.post('/users/logout');
        setAccessToken(null);
    },

    // Register a new User or Admin (Only accessible by Admins)
    registerUser: async (userData) => {
        // userData should be { username, email, password, role }
        const response = await api.post('/users/register-user', userData);
        return response.data;
    }
};
