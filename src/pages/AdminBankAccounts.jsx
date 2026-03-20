import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CreditCard, Search, ChevronDown, ChevronUp, User, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import '../styles/Admin.css';

const AdminBankAccounts = () => {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [expandedOwner, setExpandedOwner] = useState(null);
    const [accounts, setAccounts] = useState({});
    const [accountLoading, setAccountLoading] = useState(null);

    const fetchOwners = useCallback(async () => {
        setLoading(true);
        try {
            const filters = { roleName: 'Owner' };
            if (search.trim()) filters.search = search.trim();
            const data = await api.admin.getUsers(page, 20, filters);
            const res = data?.data ?? data;
            const items = res?.items ?? (Array.isArray(res) ? res : []);
            setOwners(items);
            setTotalPages(Math.max(1, res?.totalPages ?? 1));
        } catch { toast.error('Không thể tải danh sách'); }
        finally { setLoading(false); }
    }, [page, search]);

    useEffect(() => { fetchOwners(); }, [fetchOwners]);

    const toggleOwner = async (ownerId) => {
        if (expandedOwner === ownerId) { setExpandedOwner(null); return; }
        setExpandedOwner(ownerId);
        if (accounts[ownerId]) return;
        setAccountLoading(ownerId);
        try {
            const res = await api.admin.getOwnerBankAccounts(ownerId);
            const data = Array.isArray(res) ? res : (res?.items ?? res?.data ?? []);
            setAccounts(prev => ({ ...prev, [ownerId]: data }));
        } catch { toast.error('Không thể tải tài khoản ngân hàng'); }
        finally { setAccountLoading(null); }
    };

    const handleVerify = async (accountId, ownerId) => {
        if (!window.confirm('Xác minh tài khoản ngân hàng này?')) return;
        try {
            const updated = await api.admin.verifyBankAccount(accountId);
            setAccounts(prev => ({
                ...prev,
                [ownerId]: (prev[ownerId] || []).map(a =>
                    (a.id || a.ownerBankAccountId) === accountId ? { ...a, isVerified: true, ...updated } : a
                )
            }));
            toast.success('Đã xác minh tài khoản');
        } catch { toast.error('Xác minh thất bại'); }
    };

    const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchOwners(); };

    return (
        <AdminLayout title="Tài khoản ngân hàng chủ bãi" subtitle="Chọn chủ bãi để xem và xác minh tài khoản ngân hàng">
            <div className="admin-page-body">
                <form onSubmit={handleSearch} className="search-bar">
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm chủ bãi theo tên, email, số điện thoại..." className="form-control" />
                    <button type="submit" className="btn btn-primary"><Search size={16} /> Tìm kiếm</button>
                </form>

                <div className="content-section">
                    <div className="section-header"><h2>Danh sách chủ bãi (Owner)</h2></div>
                    {loading ? (
                        <div className="empty-state"><div className="spinner" /><p>Đang tải...</p></div>
                    ) : owners.length === 0 ? (
                        <div className="empty-state"><p>Không tìm thấy chủ bãi</p></div>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Chủ bãi</th>
                                        <th>Email</th>
                                        <th>Số điện thoại</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {owners.map(o => {
                                        const oid = o.userId || o.id;
                                        const isExpanded = expandedOwner === oid;
                                        const ownerAccounts = accounts[oid] || [];
                                        return (
                                            <React.Fragment key={oid}>
                                                <tr onClick={() => toggleOwner(oid)} style={{ cursor: 'pointer' }}>
                                                    <td style={{ width: 40 }}>
                                                        {isExpanded ? <ChevronUp size={18} color="#6b7280" /> : <ChevronDown size={18} color="#6b7280" />}
                                                    </td>
                                                    <td style={{ fontWeight: 600 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <User size={16} color="#d97706" />
                                                            </div>
                                                            {o.fullName || '—'}
                                                        </div>
                                                    </td>
                                                    <td>{o.email}</td>
                                                    <td>{o.phone || '—'}</td>
                                                    <td><span className={o.isActive !== false ? 'badge-success' : 'badge-danger'}>{o.isActive !== false ? 'Hoạt động' : 'Khóa'}</span></td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan={5} style={{ padding: 0, background: '#f9fafb' }}>
                                                            <div style={{ padding: '16px 24px 16px 60px' }}>
                                                                {accountLoading === oid ? (
                                                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Đang tải...</p>
                                                                ) : ownerAccounts.length === 0 ? (
                                                                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontStyle: 'italic' }}>Chủ bãi chưa thêm tài khoản ngân hàng nào</p>
                                                                ) : (
                                                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                        <thead>
                                                                            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                                                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Ngân hàng</th>
                                                                                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Số tài khoản</th>
                                                                                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Chủ TK</th>
                                                                                <th style={{ textAlign: 'center', padding: '8px 12px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Mặc định</th>
                                                                                <th style={{ textAlign: 'center', padding: '8px 12px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Xác minh</th>
                                                                                <th style={{ textAlign: 'right', padding: '8px 12px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Thao tác</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {ownerAccounts.map(a => {
                                                                                const aid = a.id || a.ownerBankAccountId;
                                                                                return (
                                                                                    <tr key={aid} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                                                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{a.bankName}</td>
                                                                                        <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{a.accountNumber}</td>
                                                                                        <td style={{ padding: '10px 12px', color: '#374151' }}>{a.accountHolderName || '—'}</td>
                                                                                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                                                            {a.isDefault ? <span className="badge-success">Mặc định</span> : <span style={{ color: '#9ca3af' }}>—</span>}
                                                                                        </td>
                                                                                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                                                            {a.isVerified ? <span className="badge-success">Đã xác minh</span> : <span className="badge-warning">Chưa xác minh</span>}
                                                                                        </td>
                                                                                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                                                                            {!a.isVerified && (
                                                                                                <button onClick={(e) => { e.stopPropagation(); handleVerify(aid, oid); }} className="btn btn-sm btn-primary" style={{ gap: 4 }}>
                                                                                                    <ShieldCheck size={14} /> Xác minh
                                                                                                </button>
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })}
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

export default AdminBankAccounts;
