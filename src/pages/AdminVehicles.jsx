import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Car, Search, Trash2, ChevronDown, ChevronUp, User } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import '../styles/Admin.css';

const AdminVehicles = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [expandedUser, setExpandedUser] = useState(null);
    const [vehicles, setVehicles] = useState({});
    const [vehicleLoading, setVehicleLoading] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const filters = {};
            if (search.trim()) filters.search = search.trim();
            const data = await api.admin.getUsers(page, 20, filters);
            const res = data?.data ?? data;
            const items = res?.items ?? (Array.isArray(res) ? res : []);
            setUsers(items);
            setTotalPages(Math.max(1, res?.totalPages ?? 1));
        } catch { toast.error('Không thể tải danh sách'); }
        finally { setLoading(false); }
    }, [page, search]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const toggleUser = async (userId) => {
        if (expandedUser === userId) { setExpandedUser(null); return; }
        setExpandedUser(userId);
        if (vehicles[userId]) return;
        setVehicleLoading(userId);
        try {
            const res = await api.admin.getVehiclesByUser(userId);
            const data = Array.isArray(res) ? res : (res?.items ?? res?.data ?? []);
            setVehicles(prev => ({ ...prev, [userId]: data }));
        } catch { toast.error('Không thể tải xe'); }
        finally { setVehicleLoading(null); }
    };

    const handleDelete = async (vehicleId, plate, userId) => {
        if (!window.confirm(`Xóa phương tiện ${plate}?`)) return;
        try {
            await api.admin.deleteVehicle(vehicleId);
            setVehicles(prev => ({
                ...prev,
                [userId]: (prev[userId] || []).filter(v => (v.vehicleId || v.id) !== vehicleId)
            }));
            toast.success('Đã xóa');
        } catch { toast.error('Xóa thất bại'); }
    };

    const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchUsers(); };

    return (
        <AdminLayout title="Quản lý phương tiện" subtitle="Chọn người dùng để xem và quản lý phương tiện">
            <div className="admin-page-body">
                <form onSubmit={handleSearch} className="search-bar">
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, email, số điện thoại..." className="form-control" />
                    <button type="submit" className="btn btn-primary"><Search size={16} /> Tìm kiếm</button>
                </form>

                <div className="content-section">
                    <div className="section-header"><h2>Danh sách người dùng</h2></div>
                    {loading ? (
                        <div className="empty-state"><div className="spinner" /><p>Đang tải...</p></div>
                    ) : users.length === 0 ? (
                        <div className="empty-state"><p>Không tìm thấy người dùng</p></div>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Người dùng</th>
                                        <th>Email</th>
                                        <th>Vai trò</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => {
                                        const uid = u.userId || u.id;
                                        const isExpanded = expandedUser === uid;
                                        const userVehicles = vehicles[uid] || [];
                                        return (
                                            <React.Fragment key={uid}>
                                                <tr onClick={() => toggleUser(uid)} style={{ cursor: 'pointer' }}>
                                                    <td style={{ width: 40 }}>
                                                        {isExpanded ? <ChevronUp size={18} color="#6b7280" /> : <ChevronDown size={18} color="#6b7280" />}
                                                    </td>
                                                    <td style={{ fontWeight: 600 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <User size={16} color="#2563eb" />
                                                            </div>
                                                            {u.fullName || '—'}
                                                        </div>
                                                    </td>
                                                    <td>{u.email}</td>
                                                    <td><span className={`badge-${u.role === 'Admin' ? 'info' : u.role === 'Owner' ? 'warning' : 'success'}`}>{u.role}</span></td>
                                                    <td><span className={u.isActive !== false ? 'badge-success' : 'badge-danger'}>{u.isActive !== false ? 'Hoạt động' : 'Khóa'}</span></td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan={5} style={{ padding: 0, background: '#f9fafb' }}>
                                                            <div style={{ padding: '16px 24px 16px 60px' }}>
                                                                {vehicleLoading === uid ? (
                                                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Đang tải xe...</p>
                                                                ) : userVehicles.length === 0 ? (
                                                                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontStyle: 'italic' }}>Người dùng chưa đăng ký phương tiện nào</p>
                                                                ) : (
                                                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                        <thead>
                                                                            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                                                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Biển số</th>
                                                                                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Loại xe</th>
                                                                                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Màu</th>
                                                                                <th style={{ textAlign: 'right', padding: '8px 12px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Thao tác</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {userVehicles.map(v => (
                                                                                <tr key={v.vehicleId || v.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                                                    <td style={{ padding: '10px 12px', fontWeight: 700, fontFamily: 'monospace' }}>{v.licensePlate}</td>
                                                                                    <td style={{ padding: '10px 12px', color: '#374151' }}>{v.vehicleType || '—'}</td>
                                                                                    <td style={{ padding: '10px 12px', color: '#374151' }}>{v.color || '—'}</td>
                                                                                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                                                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(v.vehicleId || v.id, v.licensePlate, uid); }} className="btn btn-sm btn-danger">
                                                                                            <Trash2 size={14} /> Xóa
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="btn btn-secondary btn-sm">← Trước</button>
                        <span className="pagination-info">Trang {page} / {totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn btn-secondary btn-sm">Sau →</button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminVehicles;
