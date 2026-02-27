import axios from "axios";
const API_URL = "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let accessToken = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const silentRefresh = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/users/refresh-token`,
      {},
      { withCredentials: true },
    );
    setAccessToken(response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    setAccessToken(null);
    return null;
  }
};

// Automatically attach the Bearer token to every request if we have it
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// If a request fails because the Access Token expired (403), seamlessly try to refresh it
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_URL}/users/refresh-token`,
          {},
          { withCredentials: true },
        );
        setAccessToken(response.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
