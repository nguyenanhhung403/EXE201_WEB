import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Settings, Save } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState(null);

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await api.admin.getSettings();
            setSettings(res);
        } catch (err) {
            toast.error('Không thể tải cài đặt');
        } finally { setLoading(false); }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.admin.updateSettings(settings);
            setSettings(res);
            toast.success('Đã lưu cài đặt');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Lưu thất bại');
        } finally { setSaving(false); }
    };

    const renderField = (key, value) => {
        if (typeof value === 'object' && value !== null) {
            return (
                <div key={key} style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>{key}</h3>
                    {Object.entries(value).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingLeft: 12 }}>
                            <label style={{ fontSize: 14, color: '#475569', minWidth: 200 }}>{k}</label>
                            <input
                                type={typeof v === 'number' ? 'number' : 'text'}
                                value={v ?? ''}
                                onChange={e => {
                                    const newVal = typeof v === 'number' ? Number(e.target.value) : e.target.value;
                                    setSettings(prev => ({ ...prev, [key]: { ...prev[key], [k]: newVal } }));
                                }}
                                className="form-control"
                                style={{ maxWidth: 300 }}
                            />
                        </div>
                    ))}
                </div>
            );
        }
        return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <label style={{ fontSize: 14, color: '#475569', minWidth: 200 }}>{key}</label>
                <input
                    type={typeof value === 'number' ? 'number' : 'text'}
                    value={value ?? ''}
                    onChange={e => {
                        const newVal = typeof value === 'number' ? Number(e.target.value) : e.target.value;
                        setSettings(prev => ({ ...prev, [key]: newVal }));
                    }}
                    className="form-control"
                    style={{ maxWidth: 300 }}
                />
            </div>
        );
    };

    return (
        <AdminLayout title="Cài đặt hệ thống" subtitle="Quản lý thông số hệ thống SmartParking">
            <div style={{ padding: 24, maxWidth: 800 }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>Đang tải...</p>
                ) : settings ? (
                    <div className="card" style={{ padding: 24 }}>
                        {Object.entries(settings).map(([key, value]) => renderField(key, value))}
                        <button onClick={handleSave} className="btn btn-primary" disabled={saving} style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Save size={16} />
                            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
                        </button>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#94a3b8' }}>Không có dữ liệu cài đặt</p>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
