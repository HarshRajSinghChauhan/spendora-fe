import api from "./api";

export const authApi = {
    /**
     * Register a new user
     * @param {Object} data - { name, email, password }
     * @returns {Promise<Object>}
     */
    register: async (data) => {
        const response = await api.post("/auth/register", data);
        return response.data;
    },

    /**
     * Log in an existing user
     * @param {Object} credentials - { email, password }
     * @returns {Promise<Object>}
     */
    login: async (credentials) => {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    },

    /**
     * Log out the current user session
     * @returns {Promise<Object>}
     */
    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data;
    },

    /**
     * Fetch current user profile
     * @returns {Promise<Object>}
     */
    getMe: async () => {
        const response = await api.get("/auth/me");
        return response.data;
    },

    /**
     * Request password reset link
     * @param {Object} data - { email }
     * @returns {Promise<Object>}
     */
    forgotPassword: async (data) => {
        const response = await api.post("/auth/forgot-password", data);
        return response.data;
    },

    /**
     * Reset password using token
     * @param {Object} data - { token, password }
     * @returns {Promise<Object>}
     */
    resetPassword: async (data) => {
        const response = await api.post("/auth/reset-password", data);
        return response.data;
    },
};

export default authApi;