import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL + '/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors (like 401)
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // const originalRequest = error.config;

        // TODO: Handle token refresh logic here if needed
        // For now, if 401, maybe redirect to login or clear tokens
        if (error.response && error.response.status === 401) {
            // localStorage.clear();
            // window.location.href = '/login';
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
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        },
        clearTokens: () => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
        getToken: () => localStorage.getItem('accessToken'),
        isAuthenticated: () => !!localStorage.getItem('accessToken'),
        getUser: () => {
            // If user info is stored in local storage, return it. 
            // Login.jsx strictly saves tokens. It doesn't seem to save User object strictly, 
            // but we might want to if we want to display name.
            // For now, simple check.
            return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
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
        getUsers: async (page = 1, pageSize = 20) => {
            const response = await axiosInstance.get(`/admin/users?page=${page}&pageSize=${pageSize}`);
            return response.data.data || response.data;
        },
        getParkingLots: async (page = 1, pageSize = 20) => {
            const response = await axiosInstance.get(`/admin/parking-lots?page=${page}&pageSize=${pageSize}`);
            return response.data.data || response.data;
        },
        updateUser: async (id, userData) => {
            const response = await axiosInstance.put(`/admin/users/${id}`, userData);
            return response.data;
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
        // Mock APIs for new features
        getRevenueStats: async (period = 'day') => {
            // Mock data structure
            const mockData = {
                day: [
                    { name: '00:00', revenue: 150000 }, { name: '04:00', revenue: 50000 },
                    { name: '08:00', revenue: 850000 }, { name: '12:00', revenue: 1200000 },
                    { name: '16:00', revenue: 950000 }, { name: '20:00', revenue: 1500000 },
                    { name: '23:59', revenue: 400000 },
                ],
                week: [
                    { name: 'Mon', revenue: 5200000 }, { name: 'Tue', revenue: 4800000 },
                    { name: 'Wed', revenue: 6100000 }, { name: 'Thu', revenue: 5500000 },
                    { name: 'Fri', revenue: 8200000 }, { name: 'Sat', revenue: 9500000 },
                    { name: 'Sun', revenue: 8800000 },
                ],
                month: [
                    { name: 'Week 1', revenue: 35000000 }, { name: 'Week 2', revenue: 42000000 },
                    { name: 'Week 3', revenue: 38000000 }, { name: 'Week 4', revenue: 45000000 },
                ],
                year: [
                    { name: 'Jan', revenue: 150000000 }, { name: 'Feb', revenue: 180000000 },
                    { name: 'Mar', revenue: 160000000 }, { name: 'Apr', revenue: 190000000 },
                    { name: 'May', revenue: 210000000 }, { name: 'Jun', revenue: 150000000 }, // Future months...
                ]
            };
            return new Promise(resolve => setTimeout(() => resolve(mockData[period] || mockData.week), 500));
        },
        getRecentReviews: async () => {
            return new Promise(resolve => setTimeout(() => resolve([
                { id: 1, user: 'Nguyễn Văn A', rating: 5, comment: 'Bãi đỗ xe rộng rãi, bảo vệ nhiệt tình.', date: '2024-03-15', avatar: 'A' },
                { id: 2, user: 'Trần Thị B', rating: 4, comment: 'Giá hơi cao so với mặt bằng chung.', date: '2024-03-14', avatar: 'B' },
                { id: 3, user: 'Lê Hoàng C', rating: 5, comment: 'Hệ thống check-in nhanh gọn, tuyệt vời!', date: '2024-03-14', avatar: 'C' },
                { id: 4, user: 'Phạm Minh D', rating: 3, comment: 'Lối vào hơi khó tìm.', date: '2024-03-13', avatar: 'D' },
            ]), 600));
        },
        getTopParkingLots: async () => {
            return new Promise(resolve => setTimeout(() => resolve([
                { id: 1, name: 'Vincom Center Đồng Khởi', address: 'Q.1, TP.HCM', revenue: 45000000, bookings: 150, rating: 4.8 },
                { id: 2, name: 'Landmark 81 Parking', address: 'Bình Thạnh, TP.HCM', revenue: 38000000, bookings: 120, rating: 4.9 },
                { id: 3, name: 'Sân bay Tân Sơn Nhất', address: 'Tân Bình, TP.HCM', revenue: 62000000, bookings: 300, rating: 4.5 },
                { id: 4, name: 'Aeon Mall Tân Phú', address: 'Tân Phú, TP.HCM', revenue: 28000000, bookings: 95, rating: 4.7 },
            ]), 700));
        },
        getUserDistribution: async () => {
            return new Promise(resolve => setTimeout(() => resolve([
                { name: 'Driver', value: 850 },
                { name: 'Host', value: 150 },
            ]), 600));
        }
    }
};

export default api;
