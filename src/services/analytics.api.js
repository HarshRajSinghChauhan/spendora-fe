import api from "./api";

export const analyticsApi = {
    /**
     * Fetch monthly income vs expenses data for the bar chart
     * @param {Object} params - { months?: number, range?: 'fiscal_year' | '12_months' }
     * @returns {Promise<Object>}
     */
    getIncomeVsExpenses: async (params = {}) => {
        const response = await api.get("/analytics/income-vs-expenses", { params });
        return response?.data;
    },

    /**
     * Fetch expenses grouped by category for donut chart and list breakdown
     * @param {Object} params - { period?: 'this_month' | 'last_month' | 'this_year' | 'all_time' }
     * @returns {Promise<Object>}
     */
    getExpensesByCategory: async (params = {}) => {
        const response = await api.get("/analytics/expenses-by-category", { params });
        return response?.data;
    },

    /**
     * Fetch high-level summary metrics (Total Balance, Current Month Income & Expenses)
     * @returns {Promise<Object>}
     */
    getDashboardSummary: async () => {
        const response = await api.get("/analytics/dashboard-summary");
        return response?.data;
    },
};

export default analyticsApi;
