import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MessageSquare, Trash2, Search, Filter, Star } from 'lucide-react';
import api from '../services/api';
import { formatDateTime } from '../utils/helpers';
import '../styles/Admin.css';
import AdminLayout from '../components/AdminLayout';

const Reviews = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [ratingFilter, setRatingFilter] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(null);

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
        fetchReviews();
    }, [navigate, page, ratingFilter]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const filters = {};
            if (ratingFilter) filters.rating = ratingFilter;

            const res = await api.admin.getAllReviews(page, 20, filters);
            const data = res?.data ?? res;
            const items = data?.items ?? data?.Items ?? (Array.isArray(data) ? data : []);
            setReviews(Array.isArray(items) ? items : []);
            const total = data?.totalCount ?? 0;
            setTotalPages(Math.max(1, Math.ceil(total / 20)));
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (review) => {
        const id = review.reviewId || review.id;
        if (!id) return;
        if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.')) return;

        setDeleteLoading(id);
        try {
            await api.admin.deleteReview(id);
            fetchReviews();
            toast.success('Đã xóa đánh giá thành công');
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xóa đánh giá';
            toast.error(msg);
        } finally {
            setDeleteLoading(null);
        }
    };

    const formatDate = (dateString) => (dateString ? formatDateTime(dateString) : 'N/A');

    return (
        <AdminLayout title="Quản lý Đánh giá" subtitle="Xem và kiểm duyệt đánh giá từ người dùng">
            <div className="content-section" style={{ marginBottom: '20px' }}>
                <div className="filter-bar" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div className="filter-group">
                        <label style={{ marginRight: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Lọc theo sao:</label>
                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                        >
                            <option value="">Tất cả</option>
                            <option value="5">5 Sao</option>
                            <option value="4">4 Sao</option>
                            <option value="3">3 Sao</option>
                            <option value="2">2 Sao</option>
                            <option value="1">1 Sao</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="content-section">
                {loading ? (
                    <div className="admin-loading">
                        <div className="spinner"></div>
                        <p>Đang tải đánh giá...</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Người dùng</th>
                                    <th>Bãi đỗ xe</th>
                                    <th>Đánh giá</th>
                                    <th>Nội dung</th>
                                    <th>Ngày tạo</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <tr key={review.reviewId || review.id}>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{review.userName || 'Người dùng ẩn danh'}</div>
                                            </td>
                                            <td>{review.parkingLotName || 'N/A'}</td>
                                            <td>
                                                <div style={{ display: 'flex' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            fill={i < review.rating ? "#eab308" : "none"}
                                                            color={i < review.rating ? "#eab308" : "#9ca3af"}
                                                        />
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={review.comment}>
                                                    {review.comment}
                                                </div>
                                            </td>
                                            <td className="text-gray">{formatDate(review.createdAt)}</td>
                                            <td>
                                                <button
                                                    className="action-btn reject"
                                                    onClick={() => handleDelete(review)}
                                                    disabled={deleteLoading === (review.reviewId || review.id)}
                                                    title="Xóa đánh giá"
                                                    style={{ opacity: deleteLoading === (review.reviewId || review.id) ? 0.6 : 1, cursor: deleteLoading ? 'not-allowed' : 'pointer' }}
                                                >
                                                    {deleteLoading === (review.reviewId || review.id) ? (
                                                        <span style={{ fontSize: '12px' }}>Đang xóa...</span>
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Không có đánh giá nào phù hợp</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="pagination">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Trước</button>
                        <span>Trang {page} / {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Sau</button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Reviews;
