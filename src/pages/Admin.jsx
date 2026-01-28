import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, DollarSign, Calendar, LogOut, Activity, Star, TrendingUp, MessageSquare, BarChart2, PieChart as PieIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import '../styles/Admin.css';

const Admin = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: { totalUsers: 1250, activeUsers: 1100, newUsersToday: 15 },
        parkingLots: { totalParkingLots: 45, activeParkingLots: 42, maintenanceParkingLots: 3 },
        revenue: { totalRevenue: 15600000, method: 'All' },
        bookings: { totalBookings: 850, activeBookings: 120, completedBookings: 710, cancelledBookings: 20 }
    });

    // Dummy Data for UI Demo
    const DUMMY_REVENUE = [
        { name: 'Monday', revenue: 5200000 },
        { name: 'Tuesday', revenue: 4800000 },
        { name: 'Wednesday', revenue: 6100000 },
        { name: 'Thursday', revenue: 5500000 },
        { name: 'Friday', revenue: 8200000 },
        { name: 'Saturday', revenue: 9500000 },
        { name: 'Sunday', revenue: 8800000 },
    ];

    const DUMMY_ACTIVITIES = [
        { type: 'Booking', description: 'Nguyễn Văn A vừa đặt chỗ tại Vincom Center', createdAt: new Date().toISOString() },
        { type: 'Payment', description: 'Thanh toán 50.000đ thành công', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { type: 'Login', description: 'Host Trần Thị B đăng nhập', createdAt: new Date(Date.now() - 7200000).toISOString() },
    ];

    const DUMMY_REVIEWS = [
        { id: 1, user: 'Hoàng Nam (Driver)', rating: 5, comment: 'Chủ nhà rất hiền lành, sân rộng rãi đậu xe thoải mái.', date: new Date().toISOString(), avatar: 'H' },
        { id: 2, user: 'Linh Chi (Driver)', rating: 4, comment: 'Vị trí dễ tìm, an ninh tốt. Tuy nhiên lối vào hơi nhỏ.', date: new Date(Date.now() - 86400000).toISOString(), avatar: 'L' },
        { id: 3, user: 'Tuấn Anh (Driver)', rating: 5, comment: 'Tuyệt vời! Sân có mái che mát mẻ, chủ nhà hỗ trợ nhiệt tình.', date: new Date(Date.now() - 172800000).toISOString(), avatar: 'T' },
    ];

    const DUMMY_TOP_PARKING = [
        { id: 1, name: 'Vincom Center Đồng Khởi', address: 'Q.1, TP.HCM', revenue: 45000000, bookings: 150, rating: 4.8 },
        { id: 2, name: 'Bitexco Financial Tower', address: 'Q.1, TP.HCM', revenue: 38000000, bookings: 120, rating: 4.7 },
        { id: 3, name: 'Landmark 81', address: 'Bình Thạnh, TP.HCM', revenue: 62000000, bookings: 200, rating: 4.9 },
    ];

    const DUMMY_USER_DIST = [
        { name: 'Driver', value: 850 },
        { name: 'Host', value: 150 },
    ];

    const [recentActivities, setRecentActivities] = useState(DUMMY_ACTIVITIES);
    const [revenueData, setRevenueData] = useState(DUMMY_REVENUE);
    const [revenuePeriod, setRevenuePeriod] = useState('week'); // day, week, month, year
    const [reviews, setReviews] = useState(DUMMY_REVIEWS);
    const [topParkingLots, setTopParkingLots] = useState(DUMMY_TOP_PARKING);
    const [userDistribution, setUserDistribution] = useState(DUMMY_USER_DIST);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

    useEffect(() => {
        const checkAuth = () => {
            const token = api.auth.getToken();
            if (!token) {
                navigate('/login');
                return false;
            }
            return true;
        };

        if (!checkAuth()) return;

        const fetchData = async () => {
            try {
                // Fetch basic stats
                const [usersRes, , , , activitiesRes] = await Promise.all([
                    api.admin.getUsersSummary(),
                    api.admin.getParkingLotsSummary(),
                    api.admin.getRevenueToday(),
                    api.admin.getBookingsSummary(),
                    api.admin.getRecentActivities()
                ]);

                // Map API responses to stats
                if (usersRes) {
                    setStats(prev => ({
                        ...prev,
                        users: {
                            totalUsers: usersRes.totalUsers || prev.users.totalUsers,
                            activeUsers: usersRes.totalAdmins || prev.users.activeUsers,
                            newUsersToday: usersRes.newUsersToday || prev.users.newUsersToday
                        }
                    }));
                }

                // Similar checks for other stats can be added if needed, but for now focusing on charts/lists which were empty

                if (Array.isArray(activitiesRes) && activitiesRes.length > 0) setRecentActivities(activitiesRes);

                // Fetch new features data including User Distribution
                const [revStats, topLots, recentReviews, userDist] = await Promise.all([
                    api.admin.getRevenueStats(revenuePeriod),
                    api.admin.getTopParkingLots(),
                    api.admin.getRecentReviews(),
                    api.admin.getUserDistribution()
                ]);

                if (revStats && revStats.length > 0) setRevenueData(revStats);
                if (topLots && topLots.length > 0) setTopParkingLots(topLots);
                if (recentReviews && recentReviews.length > 0) setReviews(recentReviews);
                if (userDist && userDist.length > 0) setUserDistribution(userDist);

            } catch (error) {
                console.error("Failed to fetch dashboard data, using dummy data:", error);
                // Keep dummy data on error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate, revenuePeriod]);

    const handleRevenuePeriodChange = (period) => {
        setRevenuePeriod(period);
        // In a real app, this would trigger a refetch or simple state update if data is already loaded
        // For now, dependency array handles it
    };

    const handleLogout = () => {
        api.auth.clearTokens();
        navigate('/login');
    };

    const formatDate = (dateString, simple = false) => {
        if (!dateString) return 'N/A';
        try {
            const options = simple
                ? { month: '2-digit', day: '2-digit' }
                : { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            return new Date(dateString).toLocaleString('vi-VN', options);
        } catch {
            return 'Invalid Date';
        }
    };

    if (loading) {
        return (
            <div className="admin-layout">
                <div className="admin-loading">
                    <div className="spinner"></div>
                    <p>Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>SmartParking</h2>
                    <span className="badge">Admin</span>
                </div>
                <nav className="sidebar-nav">
                    <a href="/admin" className="nav-item active">
                        <Activity size={20} />
                        <span>Dashboard</span>
                    </a>
                    <a href="/admin/users" className="nav-item">
                        <Users size={20} />
                        <span>Người dùng</span>
                    </a>
                    <a href="/admin/parking-lots" className="nav-item">
                        <MapPin size={20} />
                        <span>Bãi đỗ xe</span>
                    </a>
                    <a href="/admin/bookings" className="nav-item">
                        <Calendar size={20} />
                        <span>Đặt chỗ</span>
                    </a>
                    <a href="/admin/reviews" className="nav-item">
                        <MessageSquare size={20} />
                        <span>Đánh giá</span>
                    </a>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <div>
                        <h1>Tổng quan Dashboard</h1>
                        <p className="subtitle" style={{ color: '#000000' }}>Chào mừng quay trở lại, Admin</p>
                    </div>
                    <div className="user-menu">
                        <div className="avatar">A</div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card blue">
                        <div className="stat-icon">
                            <Users size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>Tổng thành viên</h3>
                            <p className="stat-number">{stats.users.totalUsers}</p>
                            <span className="stat-label">+{stats.users.newUsersToday} hôm nay</span>
                        </div>
                    </div>

                    <div className="stat-card green">
                        <div className="stat-icon">
                            <MapPin size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>Bãi đỗ xe</h3>
                            <p className="stat-number">{stats.parkingLots.totalParkingLots}</p>
                            <span className="stat-label">{stats.parkingLots.activeParkingLots} đang hoạt động</span>
                        </div>
                    </div>

                    <div className="stat-card orange">
                        <div className="stat-icon">
                            <DollarSign size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>Doanh thu hôm nay</h3>
                            <p className="stat-number">{stats.revenue.totalRevenue.toLocaleString()} đ</p>
                            <span className="stat-label">Doanh thu ngày</span>
                        </div>
                    </div>

                    <div className="stat-card purple">
                        <div className="stat-icon">
                            <Calendar size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>Đặt chỗ</h3>
                            <p className="stat-number">{stats.bookings.totalBookings}</p>
                            <span className="stat-label">{stats.bookings.activeBookings} đang diễn ra</span>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="dashboard-grid-row">
                    {/* Revenue Chart */}
                    <div className="content-section chart-section">
                        <div className="section-header-flex">
                            <div className="header-title">
                                <TrendingUp size={20} className="icon-mr" />
                                <h2>Biểu đồ doanh thu</h2>
                            </div>
                            <div className="period-tabs">
                                <button className={`tab ${revenuePeriod === 'day' ? 'active' : ''}`} onClick={() => handleRevenuePeriodChange('day')}>Ngày</button>
                                <button className={`tab ${revenuePeriod === 'week' ? 'active' : ''}`} onClick={() => handleRevenuePeriodChange('week')}>Tuần</button>
                                <button className={`tab ${revenuePeriod === 'month' ? 'active' : ''}`} onClick={() => handleRevenuePeriodChange('month')}>Tháng</button>
                                <button className={`tab ${revenuePeriod === 'year' ? 'active' : ''}`} onClick={() => handleRevenuePeriodChange('year')}>Năm</button>
                            </div>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <Tooltip formatter={(value) => [`${value.toLocaleString()} đ`, 'Doanh thu']} />
                                    <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* User Distribution Chart */}
                    <div className="content-section">
                        <div className="section-header">
                            <div className="header-title">
                                <PieIcon size={20} className="icon-mr" />
                                <h2>Tỷ lệ người dùng</h2>
                            </div>
                        </div>
                        <div className="chart-container" style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={userDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {userDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top Parking & Reviews */}
                <div className="dashboard-grid-row mt-6">
                    {/* Top Performing Parking Lots */}
                    <div className="content-section top-parking-section">
                        <div className="section-header">
                            <h2>Top Bãi đỗ xe</h2>
                        </div>
                        <div className="top-list">
                            {topParkingLots.map((lot, index) => (
                                <div key={lot.id} className="top-item">
                                    <div className="rank">{index + 1}</div>
                                    <div className="info">
                                        <h4>{lot.name}</h4>
                                        <p>{lot.address}</p>
                                    </div>
                                    <div className="metrics">
                                        <div className="metric">
                                            <DollarSign size={14} />
                                            <span>{(lot.revenue / 1000000).toFixed(1)}M</span>
                                        </div>
                                        <div className="metric">
                                            <Star size={14} fill="#eab308" color="#eab308" />
                                            <span>{lot.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Reviews */}
                    <div className="content-section reviews-section">
                        <div className="section-header">
                            <h2>Đánh giá mới nhất</h2>
                        </div>
                        <div className="reviews-list">
                            {reviews.map((review) => (
                                <div key={review.id} className="review-item">
                                    <div className="review-header">
                                        <div className="user-info">
                                            <div className="review-avatar">{review.avatar}</div>
                                            <div>
                                                <h4>{review.user}</h4>
                                                <div className="stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            fill={i < review.rating ? "#eab308" : "none"}
                                                            color={i < review.rating ? "#eab308" : "#9ca3af"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="review-date">{new Date(review.date).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <p className="review-comment">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="content-section mt-6">
                    <div className="section-header">
                        <h2>Hoạt động gần đây</h2>
                    </div>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Loại</th>
                                    <th>Mô tả</th>
                                    <th>Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((activity, index) => (
                                        <tr key={index}>
                                            <td><span className="status-badge login">{activity.type}</span></td>
                                            <td>{activity.description}</td>
                                            <td className="text-gray">{formatDate(activity.createdAt)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Chưa có hoạt động nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Admin;
