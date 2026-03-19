import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { formatDateTime } from '../utils/helpers';

const TRANSACTION_TYPE_MAP = {
    PlatformCommission: { label: 'Hoa hồng nền tảng', color: '#10b981', icon: '📈' },
    TopUp: { label: 'Nạp tiền', color: '#3b82f6', icon: '💰' },
    BookingPayment: { label: 'Thanh toán booking', color: '#f59e0b', icon: '🅿️' },
    BookingIncome: { label: 'Thu từ booking', color: '#10b981', icon: '💵' },
    ExtensionPayment: { label: 'Thanh toán gia hạn', color: '#f59e0b', icon: '⏱️' },
    OwnerUpgradePayment: { label: 'Phí đăng ký owner', color: '#8b5cf6', icon: '⭐' },
    Refund: { label: 'Hoàn tiền', color: '#ef4444', icon: '↩️' },
    EarlyCheckoutRefund: { label: 'Hoàn checkout sớm', color: '#ef4444', icon: '🔙' },
};

const AdminWallet = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const pageSize = 15;

    const fetchData = async (p = page) => {
        setLoading(true);
        try {
            const [balRes, txRes] = await Promise.all([
                api.admin.getWalletBalance(),
                api.admin.getWalletTransactions(p, pageSize),
            ]);
            setBalance(balRes?.balance ?? 0);
            setTransactions(txRes?.items ?? []);
            setTotalCount(txRes?.totalCount ?? 0);
        } catch (err) {
            console.error('Fetch admin wallet error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    return (
        <AdminLayout title="Ví Admin" subtitle="Quản lý doanh thu nền tảng">
            {loading && transactions.length === 0 ? (
                <div className="admin-loading">
                    <div className="spinner"></div>
                    <p>Đang tải...</p>
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '1rem',
                            padding: '2rem',
                            color: '#fff',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                                <Wallet size={22} />
                                <span style={{ fontWeight: 600 }}>Số dư ví Admin</span>
                            </div>
                            <div style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                                {formatCurrency(balance)}
                            </div>
                            <div style={{ marginTop: '0.75rem', opacity: 0.8, fontSize: '0.85rem' }}>
                                Bao gồm: hoa hồng booking + phí đăng ký owner
                            </div>
                        </div>

                        <div style={{
                            background: '#fff',
                            borderRadius: '1rem',
                            padding: '2rem',
                            border: '1px solid #e5e7eb',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Tổng giao dịch</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>{totalCount}</div>
                            <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>giao dịch trong ví admin</div>
                        </div>
                    </div>

                    <div style={{
                        background: '#fff',
                        borderRadius: '1rem',
                        border: '1px solid #e5e7eb',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid #f3f4f6',
                        }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Lịch sử giao dịch</h3>
                            <button
                                onClick={() => fetchData(page)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    background: '#f3f4f6', border: 'none', borderRadius: '0.5rem',
                                    padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.875rem',
                                    color: '#374151', fontWeight: 500,
                                }}
                            >
                                <RefreshCw size={14} /> Làm mới
                            </button>
                        </div>

                        {transactions.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                                Chưa có giao dịch nào
                            </div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb', fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left' }}>Loại</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Mô tả</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Số tiền</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Số dư sau</th>
                                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right' }}>Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => {
                                        const meta = TRANSACTION_TYPE_MAP[tx.type] || { label: tx.type, color: '#6b7280', icon: '💳' };
                                        const isPositive = tx.amount >= 0;
                                        return (
                                            <tr key={tx.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '0.875rem 1.5rem' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                                        background: `${meta.color}15`, color: meta.color,
                                                        padding: '0.25rem 0.75rem', borderRadius: '999px',
                                                        fontSize: '0.8rem', fontWeight: 600,
                                                    }}>
                                                        {meta.icon} {meta.label}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#374151', maxWidth: '300px' }}>
                                                    {tx.description || '—'}
                                                </td>
                                                <td style={{
                                                    padding: '0.875rem 1rem', textAlign: 'right',
                                                    fontWeight: 700, fontSize: '0.9rem',
                                                    color: isPositive ? '#10b981' : '#ef4444',
                                                }}>
                                                    {isPositive ? '+' : ''}{formatCurrency(tx.amount)}
                                                </td>
                                                <td style={{ padding: '0.875rem 1rem', textAlign: 'right', fontSize: '0.85rem', color: '#6b7280' }}>
                                                    {formatCurrency(tx.balanceAfter)}
                                                </td>
                                                <td style={{ padding: '0.875rem 1.5rem', textAlign: 'right', fontSize: '0.8rem', color: '#9ca3af' }}>
                                                    {formatDateTime(tx.createdAt)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}

                        {totalPages > 1 && (
                            <div style={{
                                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem',
                                padding: '1rem', borderTop: '1px solid #f3f4f6',
                            }}>
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                                        background: page <= 1 ? '#f3f4f6' : '#fff',
                                        border: '1px solid #e5e7eb', borderRadius: '0.5rem',
                                        padding: '0.5rem 0.75rem', cursor: page <= 1 ? 'default' : 'pointer',
                                        color: page <= 1 ? '#9ca3af' : '#374151', fontSize: '0.85rem',
                                    }}
                                >
                                    <ChevronLeft size={16} /> Trước
                                </button>
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                    Trang {page} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                                        background: page >= totalPages ? '#f3f4f6' : '#fff',
                                        border: '1px solid #e5e7eb', borderRadius: '0.5rem',
                                        padding: '0.5rem 0.75rem', cursor: page >= totalPages ? 'default' : 'pointer',
                                        color: page >= totalPages ? '#9ca3af' : '#374151', fontSize: '0.85rem',
                                    }}
                                >
                                    Sau <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default AdminWallet;
