import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CreditCard, Search } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

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
        } catch (err) {
            toast.error('Không tìm thấy hoặc lỗi');
            setAccounts([]);
        } finally { setLoading(false); }
    };

    return (
        <AdminLayout title="Tài khoản ngân hàng" subtitle="Xem tài khoản ngân hàng của chủ bãi">
            <div style={{ padding: 24 }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 24, maxWidth: 500 }}>
                    <input type="text" value={ownerId} onChange={e => setOwnerId(e.target.value)} placeholder="Nhập Owner User ID (GUID)..." className="form-control" />
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                        <Search size={16} /> {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                    </button>
                </form>

                {searched && (
                    <div className="card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Ngân hàng</th>
                                    <th>Mã NH</th>
                                    <th>Số tài khoản</th>
                                    <th>Chủ TK</th>
                                    <th>Mặc định</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.length === 0 ? (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>Không tìm thấy tài khoản</td></tr>
                                ) : accounts.map((a, i) => (
                                    <tr key={a.ownerBankAccountId || a.id || i}>
                                        <td style={{ fontWeight: 600 }}>{a.bankName}</td>
                                        <td>{a.bankCode || '—'}</td>
                                        <td>{a.accountNumber}</td>
                                        <td>{a.accountHolderName}</td>
                                        <td>
                                            {a.isDefault ? (
                                                <span className="badge badge-success">Mặc định</span>
                                            ) : <span style={{ color: '#94a3b8' }}>—</span>}
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

export default AdminBankAccounts;
