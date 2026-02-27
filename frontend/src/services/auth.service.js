import api, { setAccessToken } from "./api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/users/login", { email, password });
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  },

  logout: async () => {
    await api.post("/users/logout");
    setAccessToken(null);
  },

  registerUser: async (userData) => {
    const response = await api.post("/users/register-user", userData);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get("/users/get-all-users");
    return response.data;
  },
};
