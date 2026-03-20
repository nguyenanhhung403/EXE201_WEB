import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { MapPin, Trash2, Search, AlertCircle } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import '../styles/Admin.css';

const AdminLocations = () => {
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
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
            const total = data?.totalCount ?? items.length;
            setLocations(items);
            setTotalCount(total);
            setTotalPages(Math.max(1, Math.ceil(total / 20)));
        } catch {
            toast.error('Không thể tải danh sách vị trí');
        } finally { setLoading(false); }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchLocations();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa vị trí này?')) return;
        try {
            await api.admin.deleteParkingLocation(id);
            fetchLocations();
            toast.success('Đã xóa vị trí');
        } catch { toast.error('Xóa thất bại'); }
    };

    return (
        <AdminLayout title="Vị trí bãi xe" subtitle="Quản lý vị trí địa lý các bãi xe trong hệ thống">
            <div className="admin-page-body">
                <form onSubmit={handleSearch} className="search-bar">
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tỉnh/quận/phường..." className="form-control" />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <Search size={16} /> Tìm kiếm
                    </button>
                </form>

                <div className="content-section">
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Danh sách vị trí ({totalCount})</h2>
                    </div>
                    {loading ? (
                        <div className="empty-state">
                            <div className="spinner" />
                            <p>Đang tải...</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Bãi xe</th>
                                        <th>Địa chỉ</th>
                                        <th>Tọa độ</th>
                                        <th>Tỉnh/TP</th>
                                        <th>Quận/Huyện</th>
                                        <th style={{ textAlign: 'right' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {locations.length === 0 ? (
                                        <tr>
                                            <td colSpan={6}>
                                                <div className="empty-state">
                                                    <AlertCircle size={32} />
                                                    <p>Không có dữ liệu vị trí</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : locations.map(loc => (
                                        <tr key={loc.locationId || loc.id}>
                                            <td style={{ fontWeight: 600 }}>{loc.parkingLotName || '—'}</td>
                                            <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{loc.address || '—'}</td>
                                            <td>
                                                <span className="font-mono" style={{ fontSize: '0.8rem' }}>
                                                    {loc.latitude != null ? `${Number(loc.latitude).toFixed(5)}, ${Number(loc.longitude).toFixed(5)}` : '—'}
                                                </span>
                                            </td>
                                            <td>{loc.province || '—'}</td>
                                            <td>{loc.district || '—'}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button onClick={() => handleDelete(loc.locationId || loc.id)} className="btn btn-sm btn-danger">
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

                {totalPages > 1 && (
                    <div className="pagination">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="btn btn-secondary btn-sm">
                            ← Trước
                        </button>
                        <span className="pagination-info">Trang {page} / {totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn btn-secondary btn-sm">
                            Sau →
                        </button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminLocations;
