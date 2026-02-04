import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeDollarSign, Search, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../services/api';
import '../styles/Admin.css';
import AdminLayout from '../components/AdminLayout';

const Transactions = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [refundModal, setRefundModal] = useState({ show: false, transactionId: null });
    const [refundReason, setRefundReason] = useState('');
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
        fetchTransactions();
    }, [navigate, page, statusFilter]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const filters = statusFilter ? { status: statusFilter } : {};
            const response = await api.admin.getTransactions(page, 20, filters);

            if (response && response.items) {
                setTransactions(response.items);
                setTotal(response.totalCount);
            } else if (Array.isArray(response)) {
                setTransactions(response);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefund = async () => {
        if (!refundReason) {
            alert('Vui lòng nhập lý do hoàn tiền');
            return;
        }
        setActionLoading(true);
        try {
            await api.admin.processRefund(refundModal.transactionId, refundReason);
            alert('Hoàn tiền thành công');
            setRefundModal({ show: false, transactionId: null });
            fetchTransactions();
        } catch (error) {
            console.error('Refund error:', error);
            alert('Có lỗi khi xử lý hoàn tiền');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'Completed': <span className="status-badge payment" style={{ background: '#dcfce7', color: '#15803d' }}>Thành công</span>,
            'Pending': <span className="status-badge booking" style={{ background: '#fef3c7', color: '#b45309' }}>Đang xử lý</span>,
            'Refunded': <span className="status-badge error" style={{ background: '#fee2e2', color: '#b91c1c' }}>Đã hoàn tiền</span>,
            'Failed': <span className="status-badge error">Thất bại</span>
        };
        return badges[status] || <span>{status}</span>;
    };

    return (
        <AdminLayout title="Quản lý Giao dịch" subtitle="Xem lịch sử giao dịch toàn hệ thống">
            <div className="content-section" style={{ marginBottom: '20px' }}>
                <div className="filter-bar">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Completed">Thành công</option>
                        <option value="Pending">Đang xử lý</option>
                        <option value="Refunded">Đã hoàn tiền</option>
                        <option value="Failed">Thất bại</option>
                    </select>
                </div>
            </div>

            <div className="content-section">
                {loading ? (
                    <div className="admin-loading"><div className="spinner"></div></div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Mã GD</th>
                                    <th>Người dùng</th>
                                    <th>Số tiền</th>
                                    <th>Phương thức</th>
                                    <th>Thời gian</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? (
                                    transactions.map(tx => (
                                        <tr key={tx.paymentId}>
                                            <td className="font-mono" title={tx.paymentId}>
                                                {tx.transactionRef || tx.paymentId?.substring(0, 8) || 'N/A'}
                                            </td>
                                            <td>{tx.userName || 'N/A'}</td>
                                            <td style={{ fontWeight: 600 }}>{tx.amount?.toLocaleString()} đ</td>
                                            <td>{tx.paymentMethod}</td>
                                            <td className="text-gray">{new Date(tx.createdAt).toLocaleString('vi-VN')}</td>
                                            <td>{getStatusBadge(tx.paymentStatus)}</td>
                                            <td>
                                                {tx.paymentStatus === 'Completed' && (
                                                    <button
                                                        className="action-btn"
                                                        style={{ background: '#f3f4f6', color: '#374151' }}
                                                        onClick={() => setRefundModal({ show: true, transactionId: tx.paymentId })}
                                                    >
                                                        <RefreshCw size={14} /> Hoàn tiền
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Không có giao dịch nào</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Refund Modal */}
            {refundModal.show && (
                <div className="modal-overlay" onClick={() => setRefundModal({ show: false, transactionId: null })}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Xác nhận hoàn tiền</h3>
                        <p>Nhập lý do hoàn tiền cho giao dịch này:</p>
                        <textarea
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            style={{ width: '100%', minHeight: '80px', margin: '10px 0', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={() => setRefundModal({ show: false, transactionId: null })} style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', background: 'white' }}>Hủy</button>
                            <button onClick={handleRefund} disabled={actionLoading} style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#dc2626', color: 'white' }}>
                                {actionLoading ? 'Đang xử lý...' : 'Hoàn tiền'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style jsx="true">{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5); z-index: 1000;
                    display: flex; align-items: center; justify-content: center;
                }
                .modal-content {
                    background: white; padding: 24px; borderRadius: 8px; width: 400px;
                }
            `}</style>
        </AdminLayout>
    );
};

export default Transactions;
