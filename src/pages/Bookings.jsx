import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, MoreVertical } from 'lucide-react';
import api from '../services/api';
import '../styles/Admin.css';
import AdminLayout from '../components/AdminLayout';

const Bookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0
    });

    useEffect(() => {
        fetchBookings(pagination.page);
    }, [pagination.page]);

    const fetchBookings = useCallback(async (page) => {
        setLoading(true);
        try {
            const data = await api.admin.getBookings(page, pagination.pageSize);
            console.log('Bookings API Response:', data);

            setBookings(data.items || []);
            setPagination(prev => ({
                ...prev,
                page: data.page || 1,
                pageSize: data.pageSize || 20,
                totalCount: data.totalCount || 0,
                totalPages: data.totalPages || 0
            }));
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    };

    return (
        <AdminLayout title="Quản lý Đặt chỗ" subtitle="Danh sách tất cả các lượt đặt chỗ">
            <div className="content-section">
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Tất cả lượt đặt chỗ</h2>
                </div>

                {loading ? (
                    <div className="admin-loading" style={{ height: '300px' }}>
                        <div className="spinner"></div>
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Căn hộ / Bãi xe</th>
                                    <th>Biển số xe</th>
                                    <th>Địa điểm</th>
                                    <th>Thời gian</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.bookingId}>
                                        <td style={{ fontWeight: '600', color: '#000000' }}>{booking.parkingLotName || 'N/A'}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <User size={14} color="#000000" />
                                                {booking.vehiclePlate || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <MapPin size={14} color="#000000" />
                                                {booking.parkingLotName || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px', gap: '2px' }}>
                                                <span style={{ color: '#059669' }}>Vào: {formatDate(booking.checkInTime)}</span>
                                                <span style={{ color: '#dc2626' }}>Ra: {formatDate(booking.checkOutTime)}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: '600', color: '#000000' }}>
                                            {booking.totalCharge?.toLocaleString() || 0} đ
                                        </td>
                                        <td>
                                            <span className={`status-badge ${booking.status === 'Completed' ? 'payment' :
                                                booking.status === 'Active' ? 'pending' :
                                                    booking.status === 'Cancelled' ? 'error' : 'default'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="action-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000000' }}>
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#000000' }}>
                        Không tìm thấy lượt đặt chỗ nào
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Bookings;
