import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Car, Search, Trash2 } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

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
        } catch (err) {
            toast.error('Không tìm thấy hoặc lỗi');
            setVehicles([]);
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa phương tiện này?')) return;
        try {
            await api.admin.deleteVehicle(id);
            setVehicles(prev => prev.filter(v => (v.vehicleId || v.id) !== id));
            toast.success('Đã xóa');
        } catch { toast.error('Xóa thất bại'); }
    };

    return (
        <AdminLayout title="Quản lý phương tiện" subtitle="Xem và quản lý phương tiện người dùng">
            <div style={{ padding: 24 }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 24, maxWidth: 500 }}>
                    <input type="text" value={userId} onChange={e => setUserId(e.target.value)} placeholder="Nhập User ID (GUID)..." className="form-control" />
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                        <Search size={16} /> {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                    </button>
                </form>

                {searched && (
                    <div className="card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Biển số</th>
                                    <th>Loại xe</th>
                                    <th>Màu</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.length === 0 ? (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>Không tìm thấy phương tiện</td></tr>
                                ) : vehicles.map(v => (
                                    <tr key={v.vehicleId || v.id}>
                                        <td style={{ fontWeight: 600 }}>{v.licensePlate}</td>
                                        <td>{v.vehicleType || '—'}</td>
                                        <td>{v.color || '—'}</td>
                                        <td><span className={`badge ${v.isActive ? 'badge-success' : 'badge-danger'}`}>{v.isActive ? 'Hoạt động' : 'Đã xóa'}</span></td>
                                        <td>
                                            <button onClick={() => handleDelete(v.vehicleId || v.id)} className="btn btn-sm btn-danger" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Trash2 size={14} /> Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminVehicles;
