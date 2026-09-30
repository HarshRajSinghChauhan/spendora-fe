import api from "./api";

export const categoriesApi = {
    /**
     * Create a new category
     * @param {Object} data - { name, type }
     * @returns {Promise<Object>}
     */
    createCategory: async (data) => {
        const response = await api.post("/categories", data);
        return response.data;
    },

    /**
     * Get all categories with optional filters
     * @param {Object} params - { type?, page?, limit? }
     * @returns {Promise<Object>}
     */
    getAllCategories: async (params = {}) => {
        const response = await api.get("/categories", { params });
        return response.data;
    },

    /**
     * Get a category by ID
     * @param {string} id - Category UUID
     * @returns {Promise<Object>}
     */
    getCategoryById: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    /**
     * Delete a category by ID
     * @param {string} id - Category UUID
     * @returns {Promise<Object>}
     */
    deleteCategoryById: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },
};

export default categoriesApi;
