import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, DollarSign, Calendar, TrendingUp, PieChart as PieIcon, Star, MessageSquare, Receipt } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../services/api';
import '../styles/Admin.css';
import AdminLayout from '../components/AdminLayout';

const Admin = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: { totalUsers: 0, drivers: 0, owners: 0, newUsersToday: 0 },
        parkingLots: { totalParkingLots: 0, activeParkingLots: 0 },
        revenue: { totalRevenue: 0, method: 'All' },
        bookings: { totalBookings: 0, activeBookings: 0 },
        transactions: { totalTransactions: 0 },
        reviews: { totalReviews: 0 }
    });

    const [recentActivities, setRecentActivities] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [revenuePeriod, setRevenuePeriod] = useState('week');
    const [reviews, setReviews] = useState([]);
    const [topParkingLots, setTopParkingLots] = useState([]);
    const [userDistribution, setUserDistribution] = useState([]);
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
                // Fetch basic stats and new metrics
                const [
                    usersRes,
                    parkingLotsRes,
                    revenueRes,
                    bookingsRes,
                    activitiesRes,
                    driversRes,
                    ownersRes,
                    totalTransRes,
                    totalReviewsRes
                ] = await Promise.all([
                    api.admin.getUsersSummary(),
                    api.admin.getParkingLotsSummary(),
                    api.admin.getRevenueToday(),
                    api.admin.getBookingsSummary(),
                    api.admin.getRecentActivities(),
                    api.admin.getUsers(1, 1, { roleName: 'Driver' }),
                    // Assuming 'Owner' is the role name, if 'Host' is used in DB, this might need adjustment.
                    // Based on previous contexts, 'Owner' seems standard, but 'Host' was in mock data.
                    api.admin.getUsers(1, 1, { roleName: 'Owner' }),
                    api.admin.getTotalTransactions(),
                    api.admin.getTotalReviews()
                ]);

                // Map API responses to stats
                setStats(prev => ({
                    ...prev,
                    users: {
                        totalUsers: usersRes?.totalUsers || 0,
                        activeUsers: usersRes?.activeUsers || 0,
                        newUsersToday: usersRes?.newUsersToday || 0,
                        drivers: driversRes?.totalCount || 0,
                        owners: ownersRes?.totalCount || 0
                    },
                    parkingLots: {
                        totalParkingLots: parkingLotsRes?.totalParkingLots || 0,
                        activeParkingLots: parkingLotsRes?.activeParkingLots || 0,
                        maintenanceParkingLots: 0
                    },
                    revenue: {
                        totalRevenue: revenueRes?.totalRevenue || 0,
                        method: 'All'
                    },
                    bookings: {
                        totalBookings: bookingsRes?.totalBookings || 0,
                        activeBookings: bookingsRes?.activeBookings || 0
                    },
                    transactions: {
                        totalTransactions: totalTransRes || 0
                    },
                    reviews: {
                        totalReviews: totalReviewsRes || 0
                    }
                }));

                if (Array.isArray(activitiesRes)) setRecentActivities(activitiesRes);

                // Fetch charts data
                const [revStats, topLots, recentReviews, userDist] = await Promise.all([
                    api.admin.getRevenueStats(revenuePeriod),
                    api.admin.getTopParkingLots(),
                    api.admin.getRecentReviews(),
                    api.admin.getUserDistribution()
                ]);

                if (revStats) setRevenueData(revStats);
                if (topLots) setTopParkingLots(topLots);
                if (recentReviews) setReviews(recentReviews);
                if (userDist) setUserDistribution(userDist);

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate, revenuePeriod]);

    const handleRevenuePeriodChange = (period) => {
        setRevenuePeriod(period);
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

    return (
        <AdminLayout title="Tổng quan Dashboard" subtitle="Chào mừng quay trở lại, Admin">
            {loading ? (
                <div className="admin-loading">
                    <div className="spinner"></div>
                    <p>Loading Dashboard...</p>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card blue">
                            <div className="stat-icon">
                                <Users size={24} />
                            </div>
                            <div className="stat-content">
                                <h3>Tổng thành viên</h3>
                                <p className="stat-number">{stats.users.totalUsers}</p>
                                <div className="stat-breakdown">
                                    <span>{stats.users.drivers} Drivers</span>
                                    <span className="separator">|</span>
                                    <span>{stats.users.owners} Owners</span>
                                </div>
                                <span className="stat-label mt-1">+{stats.users.newUsersToday} hôm nay</span>
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

                        {/* New Cards for Transactions and Reviews */}
                        <div className="stat-card indigo">
                            <div className="stat-icon">
                                <Receipt size={24} />
                            </div>
                            <div className="stat-content">
                                <h3>Tổng giao dịch</h3>
                                <p className="stat-number">{stats.transactions.totalTransactions}</p>
                                <span className="stat-label">Toàn hệ thống</span>
                            </div>
                        </div>

                        <div className="stat-card yellow">
                            <div className="stat-icon">
                                <MessageSquare size={24} />
                            </div>
                            <div className="stat-content">
                                <h3>Tổng đánh giá</h3>
                                <p className="stat-number">{stats.reviews.totalReviews}</p>
                                <span className="stat-label">Từ người dùng</span>
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
                                    {['day', 'week', 'month', 'year'].map(p => (
                                        <button
                                            key={p}
                                            className={`tab ${revenuePeriod === p ? 'active' : ''}`}
                                            onClick={() => handleRevenuePeriodChange(p)}
                                            style={{ textTransform: 'capitalize' }}
                                        >
                                            {p === 'day' ? 'Ngày' : p === 'week' ? 'Tuần' : p === 'month' ? 'Tháng' : 'Năm'}
                                        </button>
                                    ))}
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
                </>
            )}
        </AdminLayout>
    );
};

export default Admin;
