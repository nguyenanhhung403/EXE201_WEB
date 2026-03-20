import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { MapPin, Trash2, Search } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

const AdminLocations = () => {
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchLocations(); }, [page]);

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const filters = {};
            if (search.trim()) filters.search = search.trim();
            const res = await api.admin.getParkingLocations(page, 20, filters);
            const data = res?.data ?? res;
            const items = data?.items ?? (Array.isArray(data) ? data : []);
            setLocations(items);
            setTotalPages(Math.max(1, Math.ceil((data?.totalCount ?? items.length) / 20)));
        } catch (err) {
            toast.error('Không thể tải danh sách vị trí');
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa vị trí này?')) return;
        try {
            await api.admin.deleteParkingLocation(id);
            fetchLocations();
            toast.success('Đã xóa');
        } catch { toast.error('Xóa thất bại'); }
    };

    return (
        <AdminLayout title="Vị trí bãi xe" subtitle="Quản lý vị trí địa lý các bãi xe">
            <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 24, maxWidth: 500 }}>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchLocations()} placeholder="Tìm theo tỉnh/quận/phường..." className="form-control" />
                    <button onClick={fetchLocations} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                        <Search size={16} /> Tìm
                    </button>
                </div>

                <div className="card">
                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>Đang tải...</p>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Bãi xe</th>
                                    <th>Địa chỉ</th>
                                    <th>Tọa độ</th>
                                    <th>Tỉnh/TP</th>
                                    <th>Quận/Huyện</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locations.length === 0 ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>Không có dữ liệu</td></tr>
                                ) : locations.map(loc => (
                                    <tr key={loc.locationId || loc.id}>
                                        <td style={{ fontWeight: 600 }}>{loc.parkingLotName || '—'}</td>
                                        <td>{loc.address || '—'}</td>
                                        <td style={{ fontSize: 12, color: '#64748b' }}>
                                            {loc.latitude != null ? `${Number(loc.latitude).toFixed(5)}, ${Number(loc.longitude).toFixed(5)}` : '—'}
                                        </td>
                                        <td>{loc.province || '—'}</td>
                                        <td>{loc.district || '—'}</td>
                                        <td>
                                            <button onClick={() => handleDelete(loc.locationId || loc.id)} className="btn btn-sm btn-danger" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Trash2 size={14} /> Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="btn btn-secondary">Trước</button>
                        <span style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#64748b' }}>Trang {page}/{totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn btn-secondary">Sau</button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminLocations;
