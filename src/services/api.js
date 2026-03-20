import axios from 'axios';

const API_URL = (import.meta.env.VITE_APP_API_URL || 'https://smartparkingexe.azurewebsites.net') + '/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }
        const skipRefresh = ['/auth/login', '/auth/refresh'].some((p) => originalRequest.url?.includes(p));
        if (skipRefresh) return Promise.reject(error);

        originalRequest._retry = true;
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            const res = await axios.post(
                API_URL.replace('/api', '') + '/api/auth/refresh',
                { refreshToken },
                { headers: { 'Content-Type': 'application/json' } }
            );
            const data = res.data?.data ?? res.data;
            if (data?.accessToken) localStorage.setItem('accessToken', data.accessToken);
            if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
            return axiosInstance(originalRequest);
        } catch {
            api.auth.clearTokens();
            if (typeof window !== 'undefined') window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const api = {
    auth: {
        login: async (credentials) => {
            const payload = {
                email: credentials.identifier || credentials.email,
                password: credentials.password
            };
            const response = await axiosInstance.post('/auth/login', payload);
            // Assuming the API returns { success: true, data: { accessToken, ... } }
            // Login.jsx expects response.accessToken, so we return response.data.data
            return response.data.data;
        },
        saveTokens: (accessToken, refreshToken) => {
            if (accessToken) localStorage.setItem('accessToken', accessToken);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        },
        clearTokens: () => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        },
        saveUser: (user) => {
            if (user) localStorage.setItem('user', JSON.stringify(user));
        },
        getToken: () => localStorage.getItem('accessToken'),
        isAuthenticated: () => !!localStorage.getItem('accessToken'),
        getUser: () => {
            try {
                return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
            } catch {
                return null;
            }
        },
        isAdmin: () => {
            const user = api.auth.getUser();
            return user?.role === 'Admin' || user?.roleName === 'Admin';
        },
        getProfile: async () => {
            const response = await axiosInstance.get('/users/profile');
            const data = response.data?.data ?? response.data;
            return data;
        },
        refreshToken: async () => {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) return null;
            const response = await axios.post(
                (import.meta.env.VITE_APP_API_URL || 'https://smartparkingexe.azurewebsites.net') + '/api/auth/refresh',
                { refreshToken },
                { headers: { 'Content-Type': 'application/json' } }
            );
            const data = response.data?.data ?? response.data;
            return data;
        }
    },
    admin: {
        getUsersSummary: async () => {
            const response = await axiosInstance.get('/admin/dashboard/users-summary');
            return response.data.data || response.data;
        },
        getParkingLotsSummary: async () => {
            const response = await axiosInstance.get('/admin/dashboard/parking-lots-summary');
            return response.data.data || response.data;
        },
        getRevenueToday: async () => {
            const response = await axiosInstance.get('/admin/dashboard/revenue-today');
            return response.data.data || response.data;
        },
        getBookingsSummary: async () => {
            const response = await axiosInstance.get('/admin/dashboard/bookings-summary');
            return response.data.data || response.data;
        },
        getUsers: async (page = 1, pageSize = 20, filters = {}) => {
            const params = new URLSearchParams({ page, pageSize });
            if (filters.search) params.append('search', filters.search);
            if (filters.roleName) params.append('roleName', filters.roleName);
            if (filters.isActive !== undefined && filters.isActive !== '') params.append('isActive', filters.isActive);
            if (filters.emailConfirmed !== undefined) params.append('emailConfirmed', filters.emailConfirmed);
            const response = await axiosInstance.get(`/admin/users?${params}`);
            return response.data.data || response.data;
        },
        getParkingLots: async (page = 1, pageSize = 20, filters = {}) => {
            const params = new URLSearchParams({ page, pageSize });
            if (filters.status) params.append('status', filters.status);
            if (filters.provinceCode != null && filters.provinceCode !== '') params.append('provinceCode', filters.provinceCode);
            if (filters.wardCode != null && filters.wardCode !== '') params.append('wardCode', filters.wardCode);
            if (filters.province) params.append('province', filters.province);
            if (filters.ward) params.append('ward', filters.ward);
            const response = await axiosInstance.get(`/admin/parking-lots?${params}`);
            return response.data.data || response.data;
        },
        getPendingParkingLots: async (page = 1, pageSize = 20) => {
            const response = await axiosInstance.get(`/admin/parking-lots/pending?page=${page}&pageSize=${pageSize}`);
            return response.data.data || response.data;
        },
        updateParkingLot: async (id, data) => {
            const response = await axiosInstance.put(`/admin/parking-lots/${id}`, data);
            return response.data;
        },
        deleteParkingLot: async (id) => {
            const response = await axiosInstance.delete(`/admin/parking-lots/${id}`);
            return response.data;
        },
        toggleActiveParkingLot: async (id) => {
            const response = await axiosInstance.patch(`/admin/parking-lots/${id}/toggle-active`);
            return response.data;
        },
        approveParkingLot: async (id) => {
            const response = await axiosInstance.post(`/admin/parking-lots/${id}/approve`);
            return response.data.data || response.data;
        },
        getUser: async (id) => {
            const response = await axiosInstance.get(`/admin/users/${id}`);
            return response.data.data || response.data;
        },
        updateUser: async (id, userData) => {
            const response = await axiosInstance.put(`/admin/users/${id}`, userData);
            return response.data.data || response.data;
        },
        toggleUserActive: async (id) => {
            const response = await axiosInstance.patch(`/admin/users/${id}/toggle-active`);
            return response.data.data || response.data;
        },
        // New summary methods (activities = Payment + Wallet)
        getTotalTransactions: async () => {
            const response = await axiosInstance.get('/admin/activities?pageSize=1');
            return response.data.data?.totalCount || response.data?.totalCount || 0;
        },
        getTotalReviews: async () => {
            const response = await axiosInstance.get('/admin/reviews?pageSize=1');
            return response.data.data?.totalCount || response.data?.totalCount || 0;
        },
        getBookings: async (page = 1, pageSize = 20, filters = {}) => {
            const params = new URLSearchParams({ page, pageSize, ...filters });
            const response = await axiosInstance.get(`/admin/bookings?${params}`);
            return response.data.data || response.data;
        },
        getRecentActivities: async (limit = 10) => {
            const response = await axiosInstance.get(`/admin/dashboard/recent-activities?limit=${limit}`);
            return response.data.data || response.data;
        },
        // Dashboard chart APIs (real backend)
        getRevenueStats: async (period = 'week') => {
            const response = await axiosInstance.get(`/admin/dashboard/revenue-chart?period=${period}`);
            return response.data.data || response.data || [];
        },
        getRecentReviews: async (limit = 5) => {
            const response = await axiosInstance.get(`/admin/dashboard/recent-reviews?limit=${limit}`);
            const data = response.data.data || response.data || [];
            return Array.isArray(data) ? data : [];
        },
        getTopParkingLots: async (limit = 10) => {
            const response = await axiosInstance.get(`/admin/dashboard/top-parking-lots?limit=${limit}`);
            const data = response.data.data || response.data || [];
            return Array.isArray(data) ? data : [];
        },
        getUserDistribution: async () => {
            const response = await axiosInstance.get('/admin/dashboard/user-distribution');
            const data = response.data.data || response.data || [];
            return Array.isArray(data) ? data : [];
        },
        // Owner Upgrade Requests Management
        getOwnerUpgradeRequests: async (status = '', page = 1, pageSize = 50) => {
            const params = new URLSearchParams({ page, pageSize });
            if (status) params.append('status', status);
            const response = await axiosInstance.get(`/admin/owners/upgrade-requests?${params}`);
            return response.data.data || response.data;
        },
        approveOwnerRequest: async (requestId) => {
            const response = await axiosInstance.post(`/admin/owners/upgrade-requests/${requestId}/approve`);
            return response.data;
        },
        rejectOwnerRequest: async (requestId, reason) => {
            const response = await axiosInstance.post(`/admin/owners/upgrade-requests/${requestId}/reject`, {
                reason
            });
            return response.data;
        },
        // Reviews Management
        getAllReviews: async (page = 1, pageSize = 20, filters = {}) => {
            const params = new URLSearchParams({ page, pageSize, ...filters });
            const response = await axiosInstance.get(`/admin/reviews?${params}`);
            return response.data.data || response.data;
        },
        deleteReview: async (id) => {
            const response = await axiosInstance.delete(`/admin/reviews/${id}`);
            return response.data;
        },
        // Activities (tất cả: Payment + Wallet - booking, nạp tiền, thanh toán, owner nhận, hoàn tiền...)
        getActivities: async (page = 1, pageSize = 20, filters = {}) => {
            const params = new URLSearchParams({ page, pageSize, ...filters });
            const response = await axiosInstance.get(`/admin/activities?${params}`);
            return response.data.data || response.data;
        },
        // Transactions Management (PaymentTransaction only)
        getTransactions: async (page = 1, pageSize = 20, filters = {}) => {
            const params = new URLSearchParams({ page, pageSize, ...filters });
            const response = await axiosInstance.get(`/admin/transactions?${params}`);
            return response.data.data || response.data;
        },
        processRefund: async (id, reason, refundAmount) => {
            const response = await axiosInstance.post(`/admin/transactions/${id}/refund`, {
                refundAmount: refundAmount ?? 0,
                reason
            });
            return response.data;
        },
        // Reports
        getRevenueReport: async (fromDate, toDate, period = 'monthly') => {
            const params = new URLSearchParams({ fromDate, toDate, period });
            const response = await axiosInstance.get(`/admin/reports/revenue?${params}`);
            return response.data.data || response.data;
        },
        getBookingsReport: async (fromDate, toDate) => {
            const params = new URLSearchParams({ fromDate, toDate });
            const response = await axiosInstance.get(`/admin/reports/bookings?${params}`);
            return response.data.data || response.data;
        },
        getWalletBalance: async () => {
            const response = await axiosInstance.get('/admin/wallet/balance');
            return response.data.data || response.data;
        },
        getWalletTransactions: async (page = 1, pageSize = 20) => {
            const response = await axiosInstance.get(`/admin/wallet/transactions?page=${page}&pageSize=${pageSize}`);
            return response.data.data || response.data;
        },
        // Notifications
        sendNotification: async (data) => {
            const response = await axiosInstance.post('/admin/notifications/send', data);
            return response.data;
        },
        broadcastNotification: async (data) => {
            const response = await axiosInstance.post('/admin/notifications/broadcast', data);
            return response.data;
        },
        // Settings
        getSettings: async () => {
            const response = await axiosInstance.get('/admin/settings');
            return response.data.data || response.data;
        },
        updateSettings: async (data) => {
            const response = await axiosInstance.put('/admin/settings', data);
            return response.data.data || response.data;
        },
        // Vehicles
        getVehiclesByUser: async (userId) => {
            const response = await axiosInstance.get(`/admin/vehicles/user/${userId}`);
            return response.data.data || response.data;
        },
        deleteVehicle: async (id) => {
            const response = await axiosInstance.delete(`/admin/vehicles/${id}`);
            return response.data;
        },
        // Owner Bank Accounts
        getOwnerBankAccounts: async (ownerId) => {
            const response = await axiosInstance.get(`/admin/owners/${ownerId}/bank-accounts`);
            return response.data.data || response.data;
        },
        // Parking Locations
        getParkingLocations: async (page = 1, pageSize = 20, filters = {}) => {
            const params = new URLSearchParams({ page, pageSize, ...filters });
            const response = await axiosInstance.get(`/admin/locations?${params}`);
            return response.data.data || response.data;
        },
        updateParkingLocation: async (id, data) => {
            const response = await axiosInstance.put(`/admin/locations/${id}`, data);
            return response.data;
        },
        deleteParkingLocation: async (id) => {
            const response = await axiosInstance.delete(`/admin/locations/${id}`);
            return response.data;
        }
    }
};

export default api;
