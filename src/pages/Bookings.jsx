import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreVertical, Calendar, User, MapPin, Clock, DollarSign, LogOut, Activity, Users as UsersIcon } from 'lucide-react';
import api from '../services/api';
import '../styles/Admin.css';

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
    }, [fetchBookings, pagination.page]);

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

    const handleLogout = () => {
        api.auth.clearTokens();
        navigate('/login');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    };

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>SmartParking</h2>
                    <span className="badge">Admin</span>
                </div>
                <nav className="sidebar-nav">
                    <a href="/admin" className="nav-item">
                        <Activity size={20} />
                        <span>Dashboard</span>
                    </a>
                    <a href="/admin/users" className="nav-item">
                        <UsersIcon size={20} />
                        <span>Users</span>
                    </a>
                    <a href="/admin/parking-lots" className="nav-item">
                        <MapPin size={20} />
                        <span>Parking Lots</span>
                    </a>
                    <a href="/admin/bookings" className="nav-item active">
                        <Calendar size={20} />
                        <span>Bookings</span>
                    </a>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <h1>Bookings Management</h1>
                    <div className="user-menu">
                        <span className="welcome">Welcome, Admin</span>
                        <div className="avatar">A</div>
                    </div>
                </header>

                <div className="content-section">
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>All Bookings</h2>
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
                                        <th>Parking Lot</th>
                                        <th>Vehicle Plate</th>
                                        <th>Location</th>
                                        <th>Time</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
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
                                                    <span style={{ color: '#059669' }}>In: {formatDate(booking.checkInTime)}</span>
                                                    <span style={{ color: '#dc2626' }}>Out: {formatDate(booking.checkOutTime)}</span>
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
                            No bookings found
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Bookings;
