import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CreditCard, Search, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import '../styles/Admin.css';

const AdminBankAccounts = () => {
    const [ownerId, setOwnerId] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!ownerId.trim()) { toast.error('Vui lòng nhập Owner ID'); return; }
        setLoading(true); setSearched(true);
        try {
            const res = await api.admin.getOwnerBankAccounts(ownerId.trim());
            const data = Array.isArray(res) ? res : (res?.items ?? res?.data ?? []);
            setAccounts(data);
            if (data.length === 0) toast('Không tìm thấy tài khoản nào', { icon: '🔍' });
        } catch {
            toast.error('Không tìm thấy hoặc có lỗi xảy ra');
            setAccounts([]);
        } finally { setLoading(false); }
    };

    return (
        <AdminLayout title="Tài khoản ngân hàng" subtitle="Xem tài khoản ngân hàng của chủ bãi xe">
            <div className="admin-page-body">
                <form onSubmit={handleSearch} className="search-bar">
                    <input type="text" value={ownerId} onChange={e => setOwnerId(e.target.value)} placeholder="Nhập Owner User ID (GUID) để tìm..." className="form-control" />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <Search size={16} /> {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                    </button>
                </form>

                {searched && (
                    <div className="content-section">
                        <div className="section-header">
                            <h2>Tài khoản ngân hàng ({accounts.length})</h2>
                        </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Ngân hàng</th>
                                        <th>Mã NH</th>
                                        <th>Số tài khoản</th>
                                        <th>Chủ tài khoản</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accounts.length === 0 ? (
                                        <tr>
                                            <td colSpan={5}>
                                                <div className="empty-state">
                                                    <AlertCircle size={32} />
                                                    <p>Không tìm thấy tài khoản ngân hàng</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : accounts.map((a, i) => (
                                        <tr key={a.ownerBankAccountId || a.id || i}>
                                            <td style={{ fontWeight: 600 }}>{a.bankName}</td>
                                            <td><span className="font-mono">{a.bankCode || '—'}</span></td>
                                            <td><span className="font-mono">{a.accountNumber}</span></td>
                                            <td>{a.accountHolderName}</td>
                                            <td>
                                                {a.isDefault ? (
                                                    <span className="badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                        <CheckCircle size={12} /> Mặc định
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Phụ</span>
                                                )}
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

export default AdminBankAccounts;
