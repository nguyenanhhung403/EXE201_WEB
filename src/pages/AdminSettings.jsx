import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save, RefreshCw } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import '../styles/Admin.css';

const LABEL_MAP = {
    commissionRatePercent: 'Phí hoa hồng (%)',
    monthlySubscriptionFee: 'Phí gói tháng (VND)',
    yearlySubscriptionFee: 'Phí gói năm (VND)',
    monthlySubscriptionDays: 'Số ngày gói tháng',
    yearlySubscriptionDays: 'Số ngày gói năm',
    maxParkingLotsPerOwner: 'Số bãi tối đa / Owner',
    maxVehiclesPerUser: 'Số xe tối đa / User',
    bookingCancellationMinutes: 'Hủy booking trước (phút)',
    earlyCheckoutRefundPercent: 'Hoàn checkout sớm (%)',
    latePenaltyPercent: 'Phí phạt trễ (%)',
};

const getLabel = (key) => LABEL_MAP[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());

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
        } catch {
            toast.error('Không thể tải cài đặt');
        } finally { setLoading(false); }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.admin.updateSettings(settings);
            setSettings(res);
            toast.success('Đã lưu cài đặt thành công');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Lưu thất bại');
        } finally { setSaving(false); }
    };

    const renderFields = (obj, parentKey = '') => {
        return Object.entries(obj).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return (
                    <div key={key} style={{ marginBottom: 24 }}>
                        <h3 className="settings-section-title">{getLabel(key)}</h3>
                        {renderFields(value, key)}
                    </div>
                );
            }
            return (
                <div key={key} className="settings-field">
                    <span className="settings-label">{getLabel(key)}</span>
                    <input
                        type={typeof value === 'number' ? 'number' : 'text'}
                        value={value ?? ''}
                        onChange={e => {
                            const newVal = typeof value === 'number' ? Number(e.target.value) : e.target.value;
                            if (parentKey) {
                                setSettings(prev => ({ ...prev, [parentKey]: { ...prev[parentKey], [key]: newVal } }));
                            } else {
                                setSettings(prev => ({ ...prev, [key]: newVal }));
                            }
                        }}
                        className="form-control settings-input"
                    />
                </div>
            );
        });
    };

    return (
        <AdminLayout title="Cài đặt hệ thống" subtitle="Quản lý thông số hệ thống SmartParking">
            <div className="admin-page-body" style={{ maxWidth: 800 }}>
                {loading ? (
                    <div className="empty-state">
                        <div className="spinner" />
                        <p>Đang tải cài đặt...</p>
                    </div>
                ) : settings ? (
                    <div className="card">
                        <div className="card-body">
                            {renderFields(settings)}
                            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                                <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
                                    <Save size={16} />
                                    {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
                                </button>
                                <button onClick={fetchSettings} className="btn btn-secondary" disabled={loading}>
                                    <RefreshCw size={16} /> Tải lại
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="empty-state"><p>Không có dữ liệu cài đặt</p></div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
