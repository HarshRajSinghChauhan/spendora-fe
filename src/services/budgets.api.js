import api from "./api";

export const budgetsApi = {
    /**
     * Create a new budget
     * @param {Object} data - { limitAmount, budgetType, isRecurring?, categoryId?, startDate?, endDate? }
     * @returns {Promise<Object>}
     */
    createBudget: async (data) => {
        const response = await api.post("/budgets", data);
        return response.data;
    },

    /**
     * Get paginated budgets with live spending progress and summary
     * @param {Object} params - { page?, limit?, budgetType?, categoryId?, active?, isRecurring? }
     * @returns {Promise<Object>}
     */
    getAllBudgets: async (params = {}) => {
        const cleanParams = {};
        Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== "") {
                cleanParams[key] = val;
            }
        });

        const response = await api.get("/budgets", { params: cleanParams });
        return response.data;
    },

    /**
     * Get single budget by ID
     * @param {string} id - Budget UUID
     * @returns {Promise<Object>}
     */
    getBudgetById: async (id) => {
        const response = await api.get(`/budgets/${id}`);
        return response.data;
    },

    /**
     * Update budget by ID
     * @param {string} id - Budget UUID
     * @param {Object} data - { limitAmount?, budgetType?, isRecurring?, categoryId?, startDate?, endDate? }
     * @returns {Promise<Object>}
     */
    updateBudget: async (id, data) => {
        const response = await api.patch(`/budgets/${id}`, data);
        return response.data;
    },

    /**
     * Delete budget by ID
     * @param {string} id - Budget UUID
     * @returns {Promise<Object>}
     */
    deleteBudget: async (id) => {
        const response = await api.delete(`/budgets/${id}`);
        return response.data;
    },
};

export default budgetsApi;
