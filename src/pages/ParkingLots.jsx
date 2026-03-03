import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Car, DollarSign, Plus, Pencil, Trash2, Power, X, Loader } from 'lucide-react';
import api from '../services/api';
import '../styles/Admin.css';
import AdminLayout from '../components/AdminLayout';

const ParkingLots = () => {
    const navigate = useNavigate();
    const [parkingLots, setParkingLots] = useState([]);
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
    }, [pagination.page]); // Fixed dependency array

    const fetchParkingLots = useCallback(async (page) => {
        setLoading(true);
        try {
            const data = await api.admin.getParkingLots(page, pagination.pageSize);
            console.log('Parking Lots API Response:', data);

            setParkingLots(data.items || []);
            setPagination(prev => ({
                ...prev,
                page: data.page || 1,
                pageSize: data.pageSize || 20,
                totalCount: data.totalCount || 0,
                totalPages: data.totalPages || 0
            }));
        } catch (error) {
            console.error('Failed to fetch parking lots:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize]);

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
        <AdminLayout title="Quản lý Bãi đỗ xe" subtitle="Danh sách tất cả bãi đỗ xe">
            <div className="content-section">
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Tất cả bãi đỗ xe</h2>
                    <button className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Add New Lot
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
                                            {lot.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000', fontSize: '14px', marginBottom: '8px' }}>
                                        <MapPin size={16} /> {lot.address}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e5e7eb' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Car size={16} color="#4f46e5" />
                                            <span style={{ fontWeight: '600' }}>{lot.totalCapacity}</span>
                                            <span style={{ fontSize: '12px', color: '#000000' }}>Slots</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <DollarSign size={16} color="#059669" />
                                            <span style={{ fontWeight: '600', color: '#059669' }}>
                                                {lot.pricePerHour.toLocaleString()} đ/h
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '15px 20px', borderTop: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
                        No parking lots found
                    </div>
                )}

            {/* Edit Modal */}
            {editModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Chỉnh sửa bãi xe</h2>
                            <button onClick={() => setEditModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleEditSave}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Tên bãi xe</label>
                                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Địa chỉ</label>
                                <input type="text" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Sức chứa</label>
                                    <input type="number" min="1" value={editForm.totalCapacity} onChange={(e) => setEditForm({ ...editForm, totalCapacity: e.target.value })} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Giá/giờ (đ)</label>
                                    <input type="number" min="0" step="1000" value={editForm.pricePerHour} onChange={(e) => setEditForm({ ...editForm, pricePerHour: e.target.value })} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={editForm.isActive} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} />
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Đang hoạt động</span>
                                </label>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setEditModal(null)} style={{ padding: '10px 20px', border: '1px solid #e5e7eb', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>Hủy</button>
                                <button type="submit" disabled={editSaving} style={{ padding: '10px 20px', border: 'none', borderRadius: '8px', background: '#2563eb', color: 'white', cursor: editSaving ? 'not-allowed' : 'pointer' }}>
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
