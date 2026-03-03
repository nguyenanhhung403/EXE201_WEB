import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Mail, Phone, X, Loader } from 'lucide-react';
import api from '../services/api';
import { formatDate } from '../utils/helpers';
import { getUserAvatarUrl, getUserInitials } from '../utils/images';
import '../styles/Admin.css';
import AdminLayout from '../components/AdminLayout';

const ROLE_OPTIONS = [
    { value: '', label: 'Tất cả vai trò' },
    { value: 'User', label: 'User' },
    { value: 'Owner', label: 'Owner' },
    { value: 'Admin', label: 'Admin' },
];

const validatePhone = (phone) => {
    if (!phone?.trim()) return 'Số điện thoại không được để trống';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 11) return 'Số điện thoại phải 10-11 chữ số';
    return null;
};

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        isActive: true,
    });
    const [formErrors, setFormErrors] = useState({});
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
    });

    const fetchUsers = useCallback(async (page) => {
        setLoading(true);
        try {
            const filters = { search: searchTerm || undefined, roleName: roleFilter || undefined };
            const data = await api.admin.getUsers(page, pagination.pageSize, filters);
            const res = data?.data ?? data;
            const items = res?.items ?? res?.Items ?? (Array.isArray(res) ? res : []);
            setUsers(Array.isArray(items) ? items : []);
            setPagination((prev) => ({
                ...prev,
                page: res?.page ?? 1,
                pageSize: res?.pageSize ?? 20,
                totalCount: res?.totalCount ?? 0,
                totalPages: res?.totalPages ?? 1,
            }));
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize, searchTerm, roleFilter]);

    useEffect(() => {
        fetchUsers(pagination.page);
    }, [pagination.page, searchTerm, roleFilter]);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setFormData({
            fullName: user.fullName || '',
            phone: user.phone || '',
            isActive: user.isActive ?? true,
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setFormErrors({});
        const nameErr = !formData.fullName?.trim() ? 'Họ tên không được để trống' : null;
        const phoneErr = validatePhone(formData.phone);
        if (nameErr || phoneErr) {
            setFormErrors({ fullName: nameErr, phone: phoneErr });
            return;
        }
        setUpdateLoading(true);
        setUpdateMessage({ type: '', text: '' });
        try {
            await api.admin.updateUser(selectedUser.userId, {
                fullName: formData.fullName.trim(),
                phone: formData.phone.trim(),
                isActive: formData.isActive,
            });
            setShowModal(false);
            setUpdateMessage({ type: 'success', text: 'Đã cập nhật thông tin người dùng thành công' });
            fetchUsers(pagination.page);
            setTimeout(() => setUpdateMessage({ type: '', text: '' }), 4000);
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || 'Cập nhật thất bại. Vui lòng thử lại.';
            setUpdateMessage({ type: 'error', text: msg });
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleToggleActive = async (user) => {
        setActionLoading(user.userId);
        try {
            await api.admin.toggleUserActive(user.userId);
            setUpdateMessage({ type: 'success', text: 'Đã cập nhật trạng thái người dùng' });
            fetchUsers(pagination.page);
            setTimeout(() => setUpdateMessage({ type: '', text: '' }), 4000);
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || 'Không thể cập nhật trạng thái';
            setUpdateMessage({ type: 'error', text: msg });
        } finally {
            setActionLoading(null);
        }
    };

    const formatDateLocal = (dateString) => (dateString ? formatDate(dateString) : 'N/A');

    return (
        <AdminLayout title="Quản lý Người dùng" subtitle="Danh sách tất cả người dùng hệ thống">
            <div className="content-section">
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <h2>Danh sách người dùng</h2>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input
                                type="text"
                                placeholder="Tìm theo tên, email, SĐT..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
                                style={{ padding: '8px 12px 8px 36px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '220px', fontSize: '14px' }}
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => { setRoleFilter(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
                            style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                        >
                            {ROLE_OPTIONS.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {updateMessage.text && (
                    <div
                        style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            background: updateMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
                            color: updateMessage.type === 'success' ? '#059669' : '#dc2626',
                        }}
                    >
                        {updateMessage.text}
                    </div>
                )}

                {loading ? (
                    <div className="admin-loading" style={{ height: '300px' }}>
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Người dùng</th>
                                        <th>Liên hệ</th>
                                        <th>Vai trò</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày tham gia</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user) => {
                                            const avatarUrl = getUserAvatarUrl(user);
                                            return (
                                                <tr key={user.userId}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, backgroundColor: '#e5e7eb', position: 'relative' }}>
                                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, color: '#4f46e5' }}>
                                                                    {getUserInitials(user)}
                                                                </div>
                                                                {avatarUrl && (
                                                                    <img src={avatarUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: '500' }}>{user.fullName}</div>
                                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {user.userId?.substring(0, 8)}...</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                                                <Mail size={14} color="#6b7280" /> {user.email}
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                                                <Phone size={14} color="#6b7280" /> {user.phone || '—'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`badge ${user.roleName === 'Admin' ? 'bg-purple-100 text-purple-800' : user.roleName === 'Owner' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                                                            style={{
                                                                color: user.roleName === 'Admin' ? '#6b21a8' : user.roleName === 'Owner' ? '#1e40af' : '#374151',
                                                                backgroundColor: user.roleName === 'Admin' ? '#f3e8ff' : user.roleName === 'Owner' ? '#dbeafe' : '#f3f4f6',
                                                            }}
                                                        >
                                                            {user.roleName}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${user.isActive ? 'payment' : 'error'}`}>
                                                            {user.isActive ? 'Hoạt động' : 'Khóa'}
                                                        </span>
                                                    </td>
                                                    <td>{formatDateLocal(user.createdAt)}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                            <button
                                                                onClick={() => handleEditClick(user)}
                                                                className="action-btn"
                                                                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '13px' }}
                                                            >
                                                                Sửa
                                                            </button>
                                                            <button
                                                                onClick={() => handleToggleActive(user)}
                                                                disabled={!!actionLoading}
                                                                style={{
                                                                    padding: '6px 10px',
                                                                    borderRadius: '6px',
                                                                    border: '1px solid #8b5cf6',
                                                                    background: '#f5f3ff',
                                                                    color: '#7c3aed',
                                                                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                                                                    fontSize: '13px',
                                                                }}
                                                            >
                                                                {actionLoading === user.userId ? <Loader size={14} /> : user.isActive ? 'Khóa' : 'Mở'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                                Không tìm thấy người dùng nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="pagination" style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px', gap: '10px', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                Trang {pagination.page} / {pagination.totalPages || 1}
                            </span>
                            <button
                                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                                disabled={pagination.page <= 1}
                                style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px', background: 'white', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer' }}
                            >
                                ←
                            </button>
                            <button
                                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                                disabled={pagination.page >= pagination.totalPages}
                                style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px', background: 'white', cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer' }}
                            >
                                →
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Update User Modal */}
            {showModal && selectedUser && (
                <div className="parking-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="parking-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="parking-modal-header">
                            <h2>Chỉnh sửa người dùng</h2>
                            <button type="button" onClick={() => setShowModal(false)} className="parking-modal-close" aria-label="Đóng">
                                <X size={22} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUser}>
                            <div className="parking-modal-field">
                                <label>Họ tên *</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                    placeholder="Nhập họ tên"
                                    style={{ borderColor: formErrors.fullName ? '#dc2626' : undefined }}
                                />
                                {formErrors.fullName && <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{formErrors.fullName}</span>}
                            </div>
                            <div className="parking-modal-field">
                                <label>Số điện thoại *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    placeholder="VD: 0868205403"
                                    style={{ borderColor: formErrors.phone ? '#dc2626' : undefined }}
                                />
                                {formErrors.phone && <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{formErrors.phone}</span>}
                            </div>
                            <div className="parking-modal-checkbox">
                                <input type="checkbox" id="user-isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                                <label htmlFor="user-isActive">Tài khoản hoạt động</label>
                            </div>
                            <div className="parking-modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="parking-modal-btn-cancel">
                                    Hủy
                                </button>
                                <button type="submit" disabled={updateLoading} className="parking-modal-btn-save">
                                    {updateLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Users;
