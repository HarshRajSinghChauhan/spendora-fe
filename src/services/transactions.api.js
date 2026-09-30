import api from "./api";

export const transactionsApi = {
    /**
     * Create a new transaction
     * @param {Object} data - { categoryId, amount, type, title?, notes?, transactionDate? }
     * @returns {Promise<Object>}
     */
    createTransaction: async (data) => {
        const response = await api.post("/transactions", data);
        return response.data;
    },

    /**
     * Get paginated transactions with optional filters
     * @param {Object} params - { type?, from?, to?, page?, limit? }
     * @returns {Promise<Object>}
     */
    getAllTransactions: async (params = {}) => {
        const response = await api.get("/transactions", { params });
        return response.data;
    },

    /**
     * Update an existing transaction
     * @param {string} id - Transaction UUID
     * @param {Object} data - { categoryId?, amount?, type?, title?, notes?, transactionDate? }
     * @returns {Promise<Object>}
     */
    updateTransaction: async (id, data) => {
        const response = await api.patch(`/transactions/${id}`, data);
        return response.data;
    },

    /**
     * Delete a transaction
     * @param {string} id - Transaction UUID
     * @returns {Promise<Object>}
     */
    deleteTransaction: async (id) => {
        const response = await api.delete(`/transactions/${id}`);
        return response.data;
    },
};

export default transactionsApi;
