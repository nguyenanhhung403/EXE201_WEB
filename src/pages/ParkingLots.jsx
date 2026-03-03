import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Car, DollarSign, Plus, Pencil, Trash2, Power, X, Loader, CheckCircle } from 'lucide-react';
import api from '../services/api';
import '../styles/Admin.css';
import AdminLayout from '../components/AdminLayout';

const TAB_ALL = 'all';
const TAB_PENDING = 'pending';

const ParkingLots = () => {
    const navigate = useNavigate();
    const [statusTab, setStatusTab] = useState(TAB_PENDING); // Mặc định "Chờ duyệt" - bãi xe mới tạo từ app
    const [parkingLots, setParkingLots] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editModal, setEditModal] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', address: '', totalCapacity: '', pricePerHour: '', isActive: true });
    const [editSaving, setEditSaving] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0
    });

    useEffect(() => {
        fetchParkingLots(pagination.page);
    }, [pagination.page, statusTab]);

    const fetchParkingLots = useCallback(async (page) => {
        setLoading(true);
        setFetchError(null);
        try {
            const res = statusTab === TAB_PENDING
                ? await api.admin.getPendingParkingLots(page, pagination.pageSize)
                : await api.admin.getParkingLots(page, pagination.pageSize, '');
            const data = res?.data ?? res;
            const items = data?.items ?? data?.Items ?? (Array.isArray(data) ? data : []);
            setParkingLots(Array.isArray(items) ? items : []);
            setPagination(prev => ({
                ...prev,
                page: data?.page ?? 1,
                pageSize: data?.pageSize ?? 20,
                totalCount: data?.totalCount ?? 0,
                totalPages: data?.totalPages ?? 0
            }));
        } catch (error) {
            console.error('Failed to fetch parking lots:', error);
            setFetchError(error?.response?.data?.message || error?.message || 'Lỗi khi tải. Kiểm tra đăng nhập Admin và API URL (Web/App dùng cùng backend).');
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize, statusTab]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    const handleDelete = async (lot) => {
        if (!confirm(`Bạn có chắc muốn xóa bãi xe "${lot.name}"? Hành động không thể hoàn tác.`)) return;
        setActionLoading(lot.parkingLotId);
        try {
            await api.admin.deleteParkingLot(lot.parkingLotId);
            showMessage('success', 'Đã xóa bãi xe thành công');
            fetchParkingLots(pagination.page);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Không thể xóa bãi xe';
            showMessage('error', msg);
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleActive = async (lot) => {
        setActionLoading(lot.parkingLotId);
        try {
            const res = await api.admin.toggleActiveParkingLot(lot.parkingLotId);
            const updated = res?.data ?? res;
            setParkingLots(prev => prev.map(p => p.parkingLotId === lot.parkingLotId ? { ...p, ...updated } : p));
            showMessage('success', updated?.isActive ? 'Bãi xe đã được kích hoạt' : 'Bãi xe đã tạm dừng');
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Không thể cập nhật trạng thái';
            showMessage('error', msg);
        } finally {
            setActionLoading(null);
        }
    };

    const handleApprove = async (lot) => {
        if (!confirm(`Duyệt bãi xe "${lot.name}" để hiển thị công khai?`)) return;
        setActionLoading(lot.parkingLotId);
        try {
            await api.admin.approveParkingLot(lot.parkingLotId);
            showMessage('success', 'Đã duyệt bãi xe thành công');
            fetchParkingLots(pagination.page);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Không thể duyệt bãi xe';
            showMessage('error', msg);
        } finally {
            setActionLoading(null);
        }
    };

    const handleEditClick = (lot) => {
        setEditModal(lot);
        setEditForm({
            name: lot.name || '',
            address: lot.address || '',
            totalCapacity: String(lot.totalCapacity ?? ''),
            pricePerHour: String(lot.pricePerHour ?? ''),
            isActive: lot.isActive ?? true
        });
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        if (!editModal) return;
        setEditSaving(true);
        try {
            await api.admin.updateParkingLot(editModal.parkingLotId, {
                name: editForm.name.trim(),
                address: editForm.address.trim(),
                totalCapacity: parseInt(editForm.totalCapacity, 10),
                pricePerHour: parseFloat(editForm.pricePerHour),
                isActive: editForm.isActive
            });
            showMessage('success', 'Đã cập nhật bãi xe thành công');
            setEditModal(null);
            fetchParkingLots(pagination.page);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Cập nhật thất bại';
            alert(msg);
        } finally {
            setEditSaving(false);
        }
    };

    const getDefaultImage = () => {
        return 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1000';
    };

    return (
        <AdminLayout title="Quản lý Bãi đỗ xe" subtitle={statusTab === TAB_PENDING ? 'Duyệt bãi xe mới tạo từ app (Chủ bãi → Bãi xe của tôi → Thêm)' : 'Danh sách tất cả bãi đỗ xe'}>
            <div className="content-section">
                <div className="period-tabs parking-tabs" style={{ marginBottom: '20px' }}>
                    <button type="button" className={`tab ${statusTab === TAB_PENDING ? 'active' : ''}`} onClick={() => { setStatusTab(TAB_PENDING); setPagination(p => ({ ...p, page: 1 })); }}>
                        Chờ duyệt
                    </button>
                    <button type="button" className={`tab ${statusTab === TAB_ALL ? 'active' : ''}`} onClick={() => { setStatusTab(TAB_ALL); setPagination(p => ({ ...p, page: 1 })); }}>
                        Tất cả
                    </button>
                </div>
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>{statusTab === TAB_PENDING ? 'Bãi xe chờ duyệt' : 'Tất cả bãi đỗ xe'}</h2>
                    <button className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Thêm bãi xe
                    </button>
                </div>

                {message.text && (
                    <div style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                        color: message.type === 'success' ? '#059669' : '#dc2626'
                    }}>
                        {message.text}
                    </div>
                )}

                {loading ? (
                    <div className="admin-loading" style={{ height: '300px' }}>
                        <div className="spinner"></div>
                    </div>
                ) : parkingLots.length > 0 ? (
                    <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                        {parkingLots.map((lot) => (
                            <div key={lot.parkingLotId} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '160px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                                    <img
                                        src={getDefaultImage()}
                                        alt={lot.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: '20px', flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#000000' }}>{lot.name}</h3>
                                        <span className={`status-badge ${lot.status === 'Active' ? 'payment' : 'pending'}`}>
                                            {lot.status === 'Pending' ? 'Chờ duyệt' : lot.status === 'Active' ? 'Hoạt động' : lot.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000', fontSize: '14px', marginBottom: '8px' }}>
                                        <MapPin size={16} /> {lot.address}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e5e7eb' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Car size={16} color="#4f46e5" />
                                            <span style={{ fontWeight: '600' }}>{lot.totalCapacity ?? '—'}</span>
                                            <span style={{ fontSize: '12px', color: '#6b7280' }}>chỗ</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <DollarSign size={16} color="#059669" />
                                            <span style={{ fontWeight: '600', color: '#059669' }}>
                                                {(lot.pricePerHour ?? 0).toLocaleString('vi-VN')} đ/h
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="parking-card-actions">
                                    {(lot.status === 'Pending' || lot.status === 'Chờ duyệt') && (
                                        <button
                                            onClick={() => handleApprove(lot)}
                                            disabled={!!actionLoading}
                                            style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', background: '#10b981', color: 'white', fontSize: '13px', cursor: actionLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            {actionLoading === lot.parkingLotId ? <Loader size={14} /> : <CheckCircle size={14} />}
                                            Duyệt
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEditClick(lot)}
                                        disabled={!!actionLoading}
                                        style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #d1d5db', background: 'white', fontSize: '13px', cursor: actionLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <Pencil size={14} /> Sửa
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(lot)}
                                        disabled={!!actionLoading}
                                        style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #8b5cf6', background: '#f5f3ff', fontSize: '13px', color: '#7c3aed', cursor: actionLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        {actionLoading === lot.parkingLotId ? <Loader size={14} /> : <Power size={14} />}
                                        {lot.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(lot)}
                                        disabled={!!actionLoading}
                                        style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #fecaca', background: '#fef2f2', fontSize: '13px', color: '#dc2626', cursor: actionLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        {actionLoading === lot.parkingLotId ? <Loader size={14} /> : <Trash2 size={14} />}
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#000000' }}>
                        {fetchError ? (
                            <p style={{ color: '#dc2626', marginBottom: '8px' }}>{fetchError}</p>
                        ) : null}
                        {statusTab === TAB_PENDING
                            ? 'Không có bãi xe nào chờ duyệt. Bãi xe tạo từ app (Chủ bãi → Bãi xe của tôi → Thêm) sẽ hiện ở đây. Đảm bảo Web và App dùng cùng API URL.'
                            : 'Không tìm thấy bãi xe nào'}
                    </div>
                )}

            {/* Edit Modal */}
            {editModal && (
                <div
                    className="parking-modal-overlay"
                    onClick={() => setEditModal(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div className="parking-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="parking-modal-header">
                            <h2 id="modal-title">Chỉnh sửa bãi xe</h2>
                            <button type="button" onClick={() => setEditModal(null)} className="parking-modal-close" aria-label="Đóng">
                                <X size={22} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSave}>
                            <div className="parking-modal-field">
                                <label>Tên bãi xe</label>
                                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required placeholder="Nhập tên bãi xe" />
                            </div>
                            <div className="parking-modal-field">
                                <label>Địa chỉ</label>
                                <input type="text" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} required placeholder="Nhập địa chỉ" />
                            </div>
                            <div className="parking-modal-row">
                                <div className="parking-modal-field">
                                    <label>Sức chứa (chỗ)</label>
                                    <input type="number" min="1" max="10000" value={editForm.totalCapacity} onChange={(e) => setEditForm({ ...editForm, totalCapacity: e.target.value })} required placeholder="VD: 100" />
                                </div>
                                <div className="parking-modal-field">
                                    <label>Giá/giờ (đ)</label>
                                    <input type="number" min="0" step="1000" value={editForm.pricePerHour} onChange={(e) => setEditForm({ ...editForm, pricePerHour: e.target.value })} required placeholder="VD: 15000" />
                                </div>
                            </div>
                            <div className="parking-modal-checkbox">
                                <input type="checkbox" id="edit-isActive" checked={editForm.isActive} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} />
                                <label htmlFor="edit-isActive">Đang hoạt động</label>
                            </div>
                            <div className="parking-modal-actions">
                                <button type="button" onClick={() => setEditModal(null)} className="parking-modal-btn-cancel">Hủy</button>
                                <button type="submit" disabled={editSaving} className="parking-modal-btn-save">
                                    {editSaving ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            </div>
        </AdminLayout>
    );
};

export default ParkingLots;
