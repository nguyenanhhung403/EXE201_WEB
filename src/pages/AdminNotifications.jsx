import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Bell, Send, Users } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import '../styles/Admin.css';

const AdminNotifications = () => {
    const [tab, setTab] = useState('send');
    const [userId, setUserId] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('Info');
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) { toast.error('Vui lòng điền đầy đủ'); return; }
        if (tab === 'send' && !userId.trim()) { toast.error('Vui lòng nhập User ID'); return; }
        setLoading(true);
        try {
            if (tab === 'send') {
                await api.admin.sendNotification({ userId, title, message, type });
                toast.success('Đã gửi thông báo');
            } else {
                const res = await api.admin.broadcastNotification({ title, message, type });
                const count = res?.data ?? res;
                toast.success(`Đã gửi tới ${count} người dùng`);
            }
            setTitle(''); setMessage(''); setUserId('');
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
                                <div className="form-group">
                                    <label>User ID</label>
                                    <input type="text" value={userId} onChange={e => setUserId(e.target.value)} placeholder="Nhập GUID của người dùng" className="form-control" />
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
