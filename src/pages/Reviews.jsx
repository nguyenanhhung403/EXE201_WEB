import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Activity, Users, MapPin, Calendar, MessageSquare, LogOut } from 'lucide-react';
import api from '../services/api';
import '../styles/Admin.css';

const DUMMY_REVIEWS = [
    {
        reviewId: 1,
        userName: 'Hoàng Nam',
        role: 'Driver',
        parkingLotName: 'Vincom Center Đồng Khởi',
        rating: 5,
        comment: 'Chủ nhà rất hiền lành, sân rộng rãi đậu xe thoải mái.',
        createdAt: new Date().toISOString(),
    },
    {
        reviewId: 2,
        userName: 'Linh Chi',
        role: 'Driver',
        parkingLotName: 'Bitexco Financial Tower',
        rating: 4,
        comment: 'Vị trí dễ tìm, an ninh tốt. Tuy nhiên lối vào hơi nhỏ.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        reviewId: 3,
        userName: 'Tuấn Anh',
        role: 'Driver',
        parkingLotName: 'Landmark 81',
        rating: 5,
        comment: 'Tuyệt vời! Sân có mái che mát mẻ, chủ nhà hỗ trợ nhiệt tình.',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        reviewId: 4,
        userName: 'Minh Khoa',
        role: 'Driver',
        parkingLotName: 'Vinhomes Central Park',
        rating: 3,
        comment: 'Bãi xe tạm ổn, nhưng giá hơi cao so với mặt bằng chung.',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
        reviewId: 5,
        userName: 'Thanh Hà',
        role: 'Driver',
        parkingLotName: 'Saigon Centre',
        rating: 2,
        comment: 'Khó tìm vị trí, chủ nhà không phản hồi nhanh.',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
    },
];

const StarRating = ({ rating }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={14}
                fill={i < rating ? '#eab308' : 'none'}
                color={i < rating ? '#eab308' : '#d1d5db'}
            />
        ))}
    </div>
);

const ratingBadgeStyle = (rating) => {
    if (rating >= 4) return { background: '#dcfce7', color: '#15803d' };
    if (rating === 3) return { background: '#fef9c3', color: '#a16207' };
    return { background: '#fee2e2', color: '#b91c1c' };
};

const Reviews = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRating, setFilterRating] = useState('all');

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.admin.getRecentReviews();
            if (Array.isArray(data) && data.length > 0) {
                setReviews(data);
            } else {
                setReviews(DUMMY_REVIEWS);
            }
        } catch (error) {
            console.error('Failed to fetch reviews, using dummy data:', error);
            setReviews(DUMMY_REVIEWS);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = api.auth.getToken();
        if (!token) { navigate('/login'); return; }
        fetchReviews();
    }, [fetchReviews, navigate]);

    const handleLogout = () => {
        api.auth.clearTokens();
        navigate('/login');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const filtered = filterRating === 'all'
        ? reviews
        : reviews.filter(r => r.rating === Number(filterRating));

    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : '—';

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>SmartParking</h2>
                    <span className="badge">Admin</span>
                </div>
                <nav className="sidebar-nav">
                    <a href="/admin" className="nav-item"><Activity size={20} /><span>Dashboard</span></a>
                    <a href="/admin/users" className="nav-item"><Users size={20} /><span>Người dùng</span></a>
                    <a href="/admin/parking-lots" className="nav-item"><MapPin size={20} /><span>Bãi đỗ xe</span></a>
                    <a href="/admin/bookings" className="nav-item"><Calendar size={20} /><span>Đặt chỗ</span></a>
                    <a href="/admin/reviews" className="nav-item active"><MessageSquare size={20} /><span>Đánh giá</span></a>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} /><span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <div>
                        <h1>Quản lý đánh giá</h1>
                        <p className="subtitle" style={{ color: '#6b7280', marginTop: 4 }}>
                            Tổng <strong>{reviews.length}</strong> đánh giá · Trung bình ⭐ <strong>{avgRating}</strong>
                        </p>
                    </div>
                    <div className="user-menu">
                        <div className="avatar">A</div>
                    </div>
                </header>

                {/* Summary mini-cards */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                    {[5, 4, 3, 2, 1].map(star => {
                        const count = reviews.filter(r => r.rating === star).length;
                        return (
                            <div
                                key={star}
                                onClick={() => setFilterRating(prev => prev === String(star) ? 'all' : String(star))}
                                style={{
                                    flex: 1,
                                    background: filterRating === String(star) ? '#4f46e5' : 'white',
                                    color: filterRating === String(star) ? 'white' : '#374151',
                                    borderRadius: 12,
                                    padding: '14px 16px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.2s',
                                    border: filterRating === String(star) ? '2px solid #4f46e5' : '2px solid transparent',
                                }}
                            >
                                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{count}</div>
                                <div style={{ fontSize: '0.78rem', marginTop: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                    {[...Array(star)].map((_, i) => <Star key={i} size={11} fill={filterRating === String(star) ? 'white' : '#eab308'} color={filterRating === String(star) ? 'white' : '#eab308'} />)}
                                </div>
                            </div>
                        );
                    })}
                    <div
                        onClick={() => setFilterRating('all')}
                        style={{
                            flex: 1,
                            background: filterRating === 'all' ? '#4f46e5' : 'white',
                            color: filterRating === 'all' ? 'white' : '#374151',
                            borderRadius: 12,
                            padding: '14px 16px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s',
                            border: filterRating === 'all' ? '2px solid #4f46e5' : '2px solid transparent',
                        }}
                    >
                        <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{reviews.length}</div>
                        <div style={{ fontSize: '0.78rem', marginTop: 4 }}>Tất cả</div>
                    </div>
                </div>

                <div className="content-section">
                    <div className="section-header">
                        <h2>Danh sách đánh giá ({filtered.length})</h2>
                    </div>

                    {loading ? (
                        <div className="admin-loading" style={{ height: 300 }}>
                            <div className="spinner"></div>
                        </div>
                    ) : filtered.length > 0 ? (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Người dùng</th>
                                        <th>Bãi đỗ xe</th>
                                        <th>Đánh giá</th>
                                        <th>Nội dung</th>
                                        <th>Ngày</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((review) => (
                                        <tr key={review.reviewId}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{
                                                        width: 34, height: 34, borderRadius: '50%',
                                                        background: '#e0e7ff', color: '#3730a3',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                                                    }}>
                                                        {(review.userName || 'U')[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>
                                                            {review.userName || 'N/A'}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                            {review.role || 'Driver'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ color: '#374151', fontSize: '0.875rem' }}>
                                                {review.parkingLotName || 'N/A'}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                    <StarRating rating={review.rating} />
                                                    <span style={{
                                                        ...ratingBadgeStyle(review.rating),
                                                        padding: '2px 8px',
                                                        borderRadius: 9999,
                                                        fontSize: '0.72rem',
                                                        fontWeight: 600,
                                                        display: 'inline-block',
                                                        width: 'fit-content',
                                                    }}>
                                                        {review.rating}/5
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ maxWidth: 300, color: '#4b5563', fontSize: '0.875rem', fontStyle: 'italic' }}>
                                                "{review.comment}"
                                            </td>
                                            <td style={{ color: '#6b7280', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                                {formatDate(review.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
                            Không có đánh giá nào phù hợp.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Reviews;
