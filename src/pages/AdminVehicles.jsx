import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Car, Search, Trash2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import '../styles/Admin.css';

const AdminVehicles = () => {
    const [userId, setUserId] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!userId.trim()) { toast.error('Vui lòng nhập User ID'); return; }
        setLoading(true); setSearched(true);
        try {
            const res = await api.admin.getVehiclesByUser(userId.trim());
            const data = Array.isArray(res) ? res : (res?.items ?? res?.data ?? []);
            setVehicles(data);
            if (data.length === 0) toast('Không tìm thấy phương tiện nào', { icon: '🔍' });
        } catch {
            toast.error('Không tìm thấy hoặc có lỗi xảy ra');
            setVehicles([]);
        } finally { setLoading(false); }
    };

    const handleDelete = async (id, plate) => {
        if (!window.confirm(`Xóa phương tiện ${plate}?`)) return;
        try {
            await api.admin.deleteVehicle(id);
            setVehicles(prev => prev.filter(v => (v.vehicleId || v.id) !== id));
            toast.success('Đã xóa phương tiện');
        } catch { toast.error('Xóa thất bại'); }
    };

    return (
        <AdminLayout title="Quản lý phương tiện" subtitle="Xem và quản lý phương tiện người dùng">
            <div className="admin-page-body">
                <form onSubmit={handleSearch} className="search-bar">
                    <input type="text" value={userId} onChange={e => setUserId(e.target.value)} placeholder="Nhập User ID (GUID) để tìm xe..." className="form-control" />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <Search size={16} /> {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                    </button>
                </form>

                {searched && (
                    <div className="content-section">
                        <div className="section-header">
                            <h2>Kết quả ({vehicles.length} phương tiện)</h2>
                        </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Biển số</th>
                                        <th>Loại xe</th>
                                        <th>Màu sắc</th>
                                        <th>Trạng thái</th>
                                        <th style={{ textAlign: 'right' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles.length === 0 ? (
                                        <tr>
                                            <td colSpan={5}>
                                                <div className="empty-state">
                                                    <AlertCircle size={32} />
                                                    <p>Không tìm thấy phương tiện</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : vehicles.map(v => (
                                        <tr key={v.vehicleId || v.id}>
                                            <td><span className="font-mono" style={{ fontWeight: 700 }}>{v.licensePlate}</span></td>
                                            <td>{v.vehicleType || '—'}</td>
                                            <td>{v.color || '—'}</td>
                                            <td>
                                                <span className={v.isActive !== false ? 'badge-success' : 'badge-danger'}>
                                                    {v.isActive !== false ? 'Hoạt động' : 'Đã xóa'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button onClick={() => handleDelete(v.vehicleId || v.id, v.licensePlate)} className="btn btn-sm btn-danger">
                                                    <Trash2 size={14} /> Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminVehicles;
