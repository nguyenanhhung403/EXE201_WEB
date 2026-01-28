import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreVertical, MapPin, Car, DollarSign, Plus, LogOut, Activity, Users as UsersIcon, Calendar } from 'lucide-react';
import api from '../services/api';
import '../styles/Admin.css';

const ParkingLots = () => {
    const navigate = useNavigate();
    const [parkingLots, setParkingLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0
    });

    useEffect(() => {
        fetchParkingLots(pagination.page);
    }, [fetchParkingLots, pagination.page]);

    const fetchParkingLots = useCallback(async (page) => {
        setLoading(true);
        try {
            const data = await api.admin.getParkingLots(page, pagination.pageSize);
            console.log('Parking Lots API Response:', data);

            setParkingLots(data.items || []);
            setPagination(prev => ({
                ...prev,
                page: data.page || 1,
                pageSize: data.pageSize || 20,
                totalCount: data.totalCount || 0,
                totalPages: data.totalPages || 0
            }));
        } catch (error) {
            console.error('Failed to fetch parking lots:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize]);

    const handleLogout = () => {
        api.auth.clearTokens();
        navigate('/login');
    };

    const getDefaultImage = () => {
        return 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1000';
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
                    <a href="/admin/parking-lots" className="nav-item active">
                        <MapPin size={20} />
                        <span>Parking Lots</span>
                    </a>
                    <a href="/admin/bookings" className="nav-item">
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
                    <h1>Parking Lots</h1>
                    <div className="user-menu">
                        <span className="welcome">Welcome, Admin</span>
                        <div className="avatar">A</div>
                    </div>
                </header>

                <div className="content-section">
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Manage Parking Lots</h2>
                        <button className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Plus size={18} /> Add New Lot
                        </button>
                    </div>

                    {loading ? (
                        <div className="admin-loading" style={{ height: '300px' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : parkingLots.length > 0 ? (
                        <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                            {parkingLots.map((lot) => (
                                <div key={lot.parkingLotId} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ height: '160px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                                        <img
                                            src={getDefaultImage()}
                                            alt={lot.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ padding: '20px', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#000000' }}>{lot.name}</h3>
                                            <span className={`status-badge ${lot.status === 'Active' ? 'payment' : 'pending'}`}>
                                                {lot.status}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000', fontSize: '14px', marginBottom: '8px' }}>
                                            <MapPin size={16} /> {lot.address}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e5e7eb' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Car size={16} color="#4f46e5" />
                                                <span style={{ fontWeight: '600' }}>{lot.totalCapacity}</span>
                                                <span style={{ fontSize: '12px', color: '#000000' }}>Slots</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <DollarSign size={16} color="#059669" />
                                                <span style={{ fontWeight: '600', color: '#059669' }}>
                                                    {lot.pricePerHour.toLocaleString()} đ/h
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ padding: '15px 20px', borderTop: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                        <button style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #d1d5db', background: 'white', fontSize: '13px', cursor: 'pointer' }}>
                                            Edit
                                        </button>
                                        <button style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #d1d5db', background: 'white', fontSize: '13px', color: '#dc2626', cursor: 'pointer' }}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#000000' }}>
                            No parking lots found
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ParkingLots;
