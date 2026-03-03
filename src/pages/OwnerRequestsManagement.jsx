import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import { formatDateTime } from '../utils/helpers';
import '../styles/Admin.css';
import AdminLayout from '../components/AdminLayout';

/**
 * Quản lý yêu cầu làm chủ bãi xe - Full CRUD (Read + Update)
 *
 * Endpoints (Backend):
 * - GET  /api/admin/owners/upgrade-requests?status=&page=1&pageSize=50  (Read - list)
 * - POST /api/admin/owners/upgrade-requests/{id}/approve                 (Update - duyệt)
 * - POST /api/admin/owners/upgrade-requests/{id}/reject  body: { reason } (Update - từ chối)
 *
 * Status: PendingApproval, PendingPayment, Pending, Approved, Rejected
 */
const STATUS_ALL = '';
const STATUS_PENDING_APPROVAL = 'PendingApproval';
const STATUS_APPROVED = 'Approved';
const STATUS_REJECTED = 'Rejected';

const OwnerRequestsManagement = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [statusFilter, setStatusFilter] = useState(STATUS_PENDING_APPROVAL);
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
                // Backend returns PagedResult: { items, page, pageSize, totalCount }
                const data = response.items ?? response.data ?? (Array.isArray(response) ? response : []);
                setRequests(Array.isArray(data) ? data : []);
            } else {
                setRequests([]);
            }
        } catch (error) {
            console.error('Failed to fetch owner requests:', error);
            setRequests([]);
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
            const msg = error.response?.data?.message ?? error.message ?? 'Có lỗi xảy ra khi duyệt yêu cầu';
            alert(msg);
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
            const msg = error.response?.data?.message ?? error.message ?? 'Có lỗi xảy ra khi từ chối yêu cầu';
            alert(msg);
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (dateString) => (dateString ? formatDateTime(dateString) : 'N/A');

    const getStatusBadge = (status) => {
        const badges = {
            PendingApproval: <span className="status-badge pending">Chờ duyệt</span>,
            Pending: <span className="status-badge pending">Chờ duyệt</span>,
            PendingPayment: <span className="status-badge" style={{ background: '#fef3c7', color: '#92400e' }}>Chờ TT</span>,
            Approved: <span className="status-badge completed" style={{ background: '#d1fae5', color: '#065f46' }}>Đã duyệt</span>,
            Rejected: <span className="status-badge cancelled" style={{ background: '#fee2e2', color: '#991b1b' }}>Đã từ chối</span>,
        };
        return badges[status] || <span className="status-badge">{status}</span>;
    };

    const canApproveOrReject = (status) =>
        status === 'PendingApproval' || status === 'Pending';

    return (
        <AdminLayout title="Quản lý yêu cầu làm chủ bãi xe" subtitle="Duyệt hoặc từ chối yêu cầu nâng cấp tài khoản">
            {/* Filter Tabs */}
            <div className="content-section" style={{ marginBottom: '20px' }}>
                <div className="period-tabs">
                    <button className={`tab ${statusFilter === STATUS_ALL ? 'active' : ''}`} onClick={() => setStatusFilter(STATUS_ALL)}>Tất cả</button>
                    <button className={`tab ${statusFilter === STATUS_PENDING_APPROVAL ? 'active' : ''}`} onClick={() => setStatusFilter(STATUS_PENDING_APPROVAL)}>Chờ duyệt</button>
                    <button className={`tab ${statusFilter === STATUS_APPROVED ? 'active' : ''}`} onClick={() => setStatusFilter(STATUS_APPROVED)}>Đã duyệt</button>
                    <button className={`tab ${statusFilter === STATUS_REJECTED ? 'active' : ''}`} onClick={() => setStatusFilter(STATUS_REJECTED)}>Đã từ chối</button>
                </div>
            </div>

            {/* Requests Table */}
            <div className="content-section">
                {loading ? (
                    <div className="admin-loading"><div className="spinner"></div></div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Người yêu cầu</th>
                                    <th>Email</th>
                                    <th>Tên bãi xe</th>
                                    <th>Địa chỉ</th>
                                    <th>Gói</th>
                                    <th>Phí</th>
                                    <th>TT</th>
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
                                                    <span className="status-badge completed" style={{ background: '#d1fae5', color: '#065f46' }}>Đã TT</span>
                                                ) : (
                                                    <span className="status-badge pending" style={{ background: '#fee2e2', color: '#991b1b' }}>Chưa TT</span>
                                                )}
                                            </td>
                                            <td className="text-gray">{formatDate(request.createdAt)}</td>
                                            <td>{getStatusBadge(request.status)}</td>
                                            <td>
                                                {canApproveOrReject(request.status) ? (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button className="action-btn approve" onClick={() => handleApprove(request.requestId)} disabled={actionLoading} title="Duyệt">
                                                            <CheckCircle size={16} />
                                                        </button>
                                                        <button className="action-btn reject" onClick={() => { setSelectedRequest(request); setShowRejectModal(true); }} disabled={actionLoading} title="Từ chối">
                                                            <XCircle size={16} />
                                                        </button>
                                                    </div>
                                                ) : request.status === 'Rejected' && request.rejectReason ? (
                                                    <span className="text-gray" style={{ fontSize: '0.85rem' }} title={request.rejectReason}>
                                                        Lý do...
                                                    </span>
                                                ) : (
                                                    <span className="text-gray">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>Không có yêu cầu nào</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
                    <div className="modal-content reject-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="reject-modal-header">
                            <h3>Từ chối yêu cầu</h3>
                            <p className="reject-modal-user">Người dùng: <strong>{selectedRequest?.fullName}</strong></p>
                        </div>
                        <label className="reject-modal-label">Lý do từ chối</label>
                        <textarea
                            placeholder="Nhập lý do từ chối..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="reject-modal-textarea"
                        />
                        <div className="reject-modal-actions">
                            <button type="button" onClick={() => setShowRejectModal(false)} className="reject-modal-btn-cancel">Hủy</button>
                            <button type="button" onClick={handleReject} disabled={actionLoading} className="reject-modal-btn-confirm">
                                {actionLoading ? 'Đang xử lý...' : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style jsx="true">{`
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(2px); }
                .modal-content { background: white; padding: 24px; border-radius: 12px; min-width: 400px; }
                .reject-modal { max-width: 440px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid rgba(0,0,0,0.06); }
                .reject-modal-header { margin-bottom: 16px; }
                .reject-modal-header h3 { margin: 0 0 8px 0; font-size: 1.25rem; font-weight: 600; color: #111827; }
                .reject-modal-user { margin: 0; font-size: 0.875rem; color: #6b7280; }
                .reject-modal-label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 8px; }
                .reject-modal-textarea { width: 100%; min-height: 100px; padding: 12px 14px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px; font-size: 0.9375rem; color: #111827; background: #f9fafb; resize: vertical; font-family: inherit; }
                .reject-modal-textarea::placeholder { color: #9ca3af; }
                .reject-modal-textarea:focus { outline: none; border-color: #667eea; background: #fff; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15); }
                .reject-modal-actions { display: flex; gap: 12px; justify-content: flex-end; }
                .reject-modal-btn-cancel { padding: 10px 20px; border-radius: 8px; border: 1px solid #d1d5db; background: #fff; color: #374151; font-weight: 500; font-size: 0.9375rem; cursor: pointer; transition: all 0.2s; }
                .reject-modal-btn-cancel:hover { background: #f9fafb; border-color: #9ca3af; }
                .reject-modal-btn-confirm { padding: 10px 20px; border-radius: 8px; border: none; background: #ef4444; color: #fff; font-weight: 600; font-size: 0.9375rem; cursor: pointer; transition: all 0.2s; }
                .reject-modal-btn-confirm:hover:not(:disabled) { background: #dc2626; }
                .reject-modal-btn-confirm:disabled { opacity: 0.7; cursor: not-allowed; }
                .action-btn { padding: 6px; border-radius: 6px; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .action-btn.approve { background: #10b981; color: white; }
                .action-btn.reject { background: #ef4444; color: white; }
            `}</style>
        </AdminLayout>
    );
};

export default OwnerRequestsManagement;
