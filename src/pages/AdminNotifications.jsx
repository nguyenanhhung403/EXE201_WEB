import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Bell, Send, Users, Search, X } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import '../styles/Admin.css';

const AdminNotifications = () => {
    const [tab, setTab] = useState('send');
    const [selectedUser, setSelectedUser] = useState(null);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('Info');
    const [loading, setLoading] = useState(false);

    const [userSearch, setUserSearch] = useState('');
    const [userResults, setUserResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searching, setSearching] = useState(false);
    const dropdownRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchUsers = useCallback(async (q) => {
        if (!q.trim() || q.trim().length < 2) { setUserResults([]); setShowDropdown(false); return; }
        setSearching(true);
        try {
            const data = await api.admin.getUsers(1, 10, { search: q.trim() });
            const res = data?.data ?? data;
            const items = res?.items ?? (Array.isArray(res) ? res : []);
            setUserResults(items);
            setShowDropdown(items.length > 0);
        } catch { setUserResults([]); }
        finally { setSearching(false); }
    }, []);

    const handleUserSearchChange = (e) => {
        const val = e.target.value;
        setUserSearch(val);
        setSelectedUser(null);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => searchUsers(val), 400);
    };

    const pickUser = (u) => {
        setSelectedUser(u);
        setUserSearch(u.fullName || u.email);
        setShowDropdown(false);
    };

    const clearUser = () => {
        setSelectedUser(null);
        setUserSearch('');
        setUserResults([]);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) { toast.error('Vui lòng điền đầy đủ'); return; }
        if (tab === 'send' && !selectedUser) { toast.error('Vui lòng chọn người dùng'); return; }
        setLoading(true);
        try {
            if (tab === 'send') {
                const userId = selectedUser.userId || selectedUser.id;
                await api.admin.sendNotification({ userId, title, message, type });
                toast.success(`Đã gửi thông báo tới ${selectedUser.fullName || selectedUser.email}`);
            } else {
                const res = await api.admin.broadcastNotification({ title, message, type });
                const count = res?.data ?? res;
                toast.success(`Đã gửi tới ${count} người dùng`);
            }
            setTitle(''); setMessage(''); clearUser();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Gửi thông báo thất bại');
        } finally { setLoading(false); }
    };

    return (
        <AdminLayout title="Quản lý thông báo" subtitle="Gửi thông báo tới người dùng">
            <div className="admin-page-body" style={{ maxWidth: 640 }}>
                <div className="tab-group">
                    <button onClick={() => setTab('send')} className={`btn ${tab === 'send' ? 'btn-primary' : 'btn-secondary'}`}>
                        <Send size={16} /> Gửi cho 1 người
                    </button>
                    <button onClick={() => setTab('broadcast')} className={`btn ${tab === 'broadcast' ? 'btn-primary' : 'btn-secondary'}`}>
                        <Users size={16} /> Gửi tất cả
                    </button>
                </div>

                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            {tab === 'send' && (
                                <div className="form-group" ref={dropdownRef} style={{ position: 'relative' }}>
                                    <label>Người nhận</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={userSearch}
                                            onChange={handleUserSearchChange}
                                            placeholder="Tìm theo tên, email hoặc SĐT..."
                                            className="form-control"
                                            style={{ paddingRight: selectedUser ? 36 : 12 }}
                                        />
                                        {selectedUser && (
                                            <button type="button" onClick={clearUser}
                                                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}>
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                    {selectedUser && (
                                        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: '#059669', fontWeight: 500 }}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                                            Đã chọn: {selectedUser.fullName} ({selectedUser.email}) — {selectedUser.role}
                                        </div>
                                    )}
                                    {showDropdown && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 50, maxHeight: 260, overflowY: 'auto', marginTop: 4 }}>
                                            {userResults.map(u => (
                                                <div key={u.userId || u.id} onClick={() => pickUser(u)}
                                                    style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                                                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.fullName || '—'}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{u.email}</div>
                                                    </div>
                                                    <span className={`badge-${u.role === 'Admin' ? 'info' : u.role === 'Owner' ? 'warning' : 'success'}`} style={{ fontSize: '0.7rem' }}>{u.role}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {searching && <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 4 }}>Đang tìm...</div>}
                                </div>
                            )}
                            <div className="form-group">
                                <label>Loại thông báo</label>
                                <select value={type} onChange={e => setType(e.target.value)} className="form-control">
                                    <option value="Info">Thông tin</option>
                                    <option value="Warning">Cảnh báo</option>
                                    <option value="Success">Thành công</option>
                                    <option value="Error">Lỗi</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Tiêu đề</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nhập tiêu đề thông báo" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Nội dung</label>
                                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Nhập nội dung thông báo..." className="form-control" rows={4} />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', padding: '12px 28px' }}>
                                <Bell size={16} />
                                {loading ? 'Đang gửi...' : tab === 'send' ? 'Gửi thông báo' : 'Gửi tới tất cả'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminNotifications;
