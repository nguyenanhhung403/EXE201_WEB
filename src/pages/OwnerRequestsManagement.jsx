import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, LogOut, Activity, UserCheck, CheckCircle, XCircle, Calendar } from 'lucide-react';
import api from '../services/api';
import '../styles/Admin.css';

const OwnerRequestsManagement = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [statusFilter, setStatusFilter] = useState('Pending');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

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
        fetchRequests();
    }, [navigate, statusFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await api.admin.getOwnerUpgradeRequests(statusFilter, 1, 50);
            if (response) {
                // Handle PagedResult (response.items) or standard List (response.data or response)
                const data = response.items || response.data || (Array.isArray(response) ? response : []);
                setRequests(data);
            }
        } catch (error) {
            console.error('Failed to fetch owner requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        if (!confirm('Bạn có chắc chắn muốn duyệt yêu cầu này không?')) return;

        setActionLoading(true);
        try {
            await api.admin.approveOwnerRequest(requestId);
            alert('Đã duyệt thành công!');
            fetchRequests();
        } catch (error) {
            console.error('Approve error:', error);
            alert('Có lỗi xảy ra khi duyệt yêu cầu');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            alert('Vui lòng nhập lý do từ chối');
            return;
        }

        setActionLoading(true);
        try {
            await api.admin.rejectOwnerRequest(selectedRequest.requestId, rejectReason);
            alert('Đã từ chối yêu cầu');
            setShowRejectModal(false);
            setRejectReason('');
            setSelectedRequest(null);
            fetchRequests();
        } catch (error) {
            console.error('Reject error:', error);
            alert('Có lỗi xảy ra khi từ chối yêu cầu');
        } finally {
            setActionLoading(false);
        }
    };

    const handleLogout = () => {
        api.auth.clearTokens();
        navigate('/login');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'Pending': <span className="status-badge pending">Chờ duyệt</span>,
            'Approved': <span className="status-badge completed">Đã duyệt</span>,
            'Rejected': <span className="status-badge cancelled">Đã từ chối</span>,
        };
        return badges[status] || <span className="status-badge">{status}</span>;
    };

    if (loading) {
        return (
            <div className="admin-layout">
                <div className="admin-loading">
                    <div className="spinner"></div>
                    <p>Đang tải...</p>
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
                    <a href="/admin" className="nav-item">
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
                    <a href="/admin/owner-requests" className="nav-item active">
                        <UserCheck size={20} />
                        <span>Yêu cầu làm chủ bãi</span>
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
                        <h1>Quản lý yêu cầu làm chủ bãi xe</h1>
                        <p className="subtitle" style={{ color: '#000000' }}>Duyệt hoặc từ chối yêu cầu nâng cấp tài khoản</p>
                    </div>
                    <div className="user-menu">
                        <div className="avatar">A</div>
                    </div>
                </header>

                {/* Filter Tabs */}
                <div className="content-section" style={{ marginBottom: '20px' }}>
                    <div className="period-tabs">
                        <button
                            className={`tab ${statusFilter === '' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('')}
                        >
                            Tất cả
                        </button>
                        <button
                            className={`tab ${statusFilter === 'Pending' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('Pending')}
                        >
                            Chờ duyệt
                        </button>
                        <button
                            className={`tab ${statusFilter === 'Approved' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('Approved')}
                        >
                            Đã duyệt
                        </button>
                        <button
                            className={`tab ${statusFilter === 'Rejected' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('Rejected')}
                        >
                            Đã từ chối
                        </button>
                    </div>
                </div>

                {/* Requests Table */}
                <div className="content-section">
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Người yêu cầu</th>
                                    <th>Email</th>
                                    <th>Tên bãi xe</th>
                                    <th>Địa chỉ</th>
                                    <th>Gói đăng ký</th>
                                    <th>Phí</th>
                                    <th>Thanh toán</th>
                                    <th>Ngày tạo</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length > 0 ? (
                                    requests.map((request) => (
                                        <tr key={request.requestId}>
                                            <td>{request.fullName}</td>
                                            <td>{request.email}</td>
                                            <td><strong>{request.parkingLotName}</strong></td>
                                            <td className="text-gray">{request.parkingLotAddress}</td>
                                            <td>{request.planType === 'Monthly' ? 'Tháng' : 'Năm'}</td>
                                            <td>{request.feeAmount?.toLocaleString()} đ</td>
                                            <td>
                                                {request.paymentTransactionId ? (
                                                    <span className="status-badge completed" style={{ background: '#d1fae5', color: '#065f46' }}>Đã thanh toán</span>
                                                ) : (
                                                    <span className="status-badge pending" style={{ background: '#fee2e2', color: '#991b1b' }}>Chưa thanh toán</span>
                                                )}
                                            </td>
                                            <td className="text-gray">{formatDate(request.createdAt)}</td>
                                            <td>{getStatusBadge(request.status)}</td>
                                            <td>
                                                {request.status === 'Pending' ? (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            className="action-btn approve"
                                                            onClick={() => handleApprove(request.requestId)}
                                                            disabled={actionLoading}
                                                        >
                                                            <CheckCircle size={16} />
                                                            Duyệt
                                                        </button>
                                                        <button
                                                            className="action-btn reject"
                                                            onClick={() => {
                                                                setSelectedRequest(request);
                                                                setShowRejectModal(true);
                                                            }}
                                                            disabled={actionLoading}
                                                        >
                                                            <XCircle size={16} />
                                                            Từ chối
                                                        </button>
                                                    </div>
                                                ) : request.status === 'Rejected' && request.rejectReason ? (
                                                    <span className="text-gray" style={{ fontSize: '0.85rem' }}>
                                                        Lý do: {request.rejectReason}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                                            Không có yêu cầu nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Từ chối yêu cầu</h2>
                        <p style={{ marginBottom: '20px', color: '#6b7280' }}>
                            Người dùng: <strong>{selectedRequest?.fullName}</strong>
                        </p>
                        <textarea
                            placeholder="Nhập lý do từ chối..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                fontSize: '14px',
                                marginBottom: '20px'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReason('');
                                }}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    background: '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={actionLoading}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#ef4444',
                                    color: '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                {actionLoading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx="true">{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    padding: 30px;
                    border-radius: 12px;
                    min-width: 500px;
                    max-width: 600px;
                }
                .action-btn {
                    padding: 6px 12px;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                    font-size: 0.85rem;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    transition: all 0.2s;
                }
                .action-btn.approve {
                    background: #10b981;
                    color: white;
                }
                .action-btn.approve:hover {
                    background: #059669;
                }
                .action-btn.reject {
                    background: #ef4444;
                    color: white;
                }
                .action-btn.reject:hover {
                    background: #dc2626;
                }
                .action-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .status-badge.pending {
                    background: #fbbf24;
                    color: #78350f;
                }
            `}</style>
        </div>
    );
};

export default OwnerRequestsManagement;
