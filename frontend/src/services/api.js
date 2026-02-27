import axios from 'axios';

// You can change this base URL in your .env later if needed
const API_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // This is crucial to send/receive the HttpOnly Refresh Token Cookie!
});

// Store access token in memory
let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

// --- Request Interceptor ---
// Automatically attach the Bearer token to every request if we have it
api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- Response Interceptor ---
// If a request fails because the Access Token expired (403), seamlessly try to refresh it
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 403 (Forbidden/Expired) and we haven't retried yet
        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to hit the refresh endpoint (this will automatically send the HttpOnly cookie)
                const response = await axios.post(`${API_URL}/users/refresh-token`, {}, { withCredentials: true });

                // Save the new token
                setAccessToken(response.data.accessToken);

                // Update the failed request with the new token and try again
                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails (Refresh token is completely expired/invalid), user MUST log back in
                setAccessToken(null);
                // We can force a redirect using window.location if necessary
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
