import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreVertical, Shield, User, Phone, Mail, Calendar, LogOut, ChevronLeft, ChevronRight, Activity, Users as UsersIcon, MapPin, MessageSquare, X } from 'lucide-react';
import api from '../services/api';
import '../styles/Admin.css';

const DUMMY_USERS = [
    {
        userId: 'u-0001',
        fullName: 'Nguyễn Văn An',
        email: 'an.nguyen@gmail.com',
        phone: '0901234567',
        roleName: 'Driver',
        isActive: true,
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
        userId: 'u-0002',
        fullName: 'Trần Thị Bích',
        email: 'bich.tran@gmail.com',
        phone: '0912345678',
        roleName: 'Host',
        isActive: true,
        createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    },
    {
        userId: 'u-0003',
        fullName: 'Lê Minh Khoa',
        email: 'khoa.le@gmail.com',
        phone: '0923456789',
        roleName: 'Driver',
        isActive: true,
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
        userId: 'u-0004',
        fullName: 'Phạm Thùy Linh',
        email: 'linh.pham@gmail.com',
        phone: '0934567890',
        roleName: 'Host',
        isActive: false,
        createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    },
    {
        userId: 'u-0005',
        fullName: 'Hoàng Tuấn Kiệt',
        email: 'kiet.hoang@gmail.com',
        phone: '0945678901',
        roleName: 'Driver',
        isActive: true,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
        userId: 'u-0006',
        fullName: 'Võ Thị Thu Hương',
        email: 'huong.vo@gmail.com',
        phone: '0956789012',
        roleName: 'Driver',
        isActive: true,
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    },
    {
        userId: 'u-0007',
        fullName: 'Đặng Quốc Hùng',
        email: 'hung.dang@gmail.com',
        phone: '0967890123',
        roleName: 'Host',
        isActive: true,
        createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    },
    {
        userId: 'u-0008',
        fullName: 'Admin Hệ thống',
        email: 'admin@smartparking.vn',
        phone: '0978901234',
        roleName: 'Admin',
        isActive: true,
        createdAt: new Date(Date.now() - 86400000 * 365).toISOString(),
    },
];

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        isActive: true,
        roleId: 1
    });
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0
    });

    const fetchUsers = async (page) => {
        setLoading(true);
        try {
            const data = await api.admin.getUsers(page, pagination.pageSize);
            if (data && data.items && data.items.length > 0) {
                setUsers(data.items);
                setPagination(prev => ({
                    ...prev,
                    totalCount: data.totalCount || 0,
                    totalPages: data.totalPages || 1
                }));
            } else {
                setUsers(DUMMY_USERS);
                setPagination(prev => ({
                    ...prev,
                    totalCount: DUMMY_USERS.length,
                    totalPages: 1
                }));
            }
        } catch (error) {
            console.error('Failed to fetch users, using dummy data:', error);
            setUsers(DUMMY_USERS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(pagination.page);
    }, [pagination.page]);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setFormData({
            fullName: user.fullName || '',
            phone: user.phone || '',
            isActive: user.isActive,
            roleId: user.roleId || 1
        });
        setShowModal(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await api.admin.updateUser(selectedUser.userId, formData);
            setShowModal(false);
            fetchUsers(pagination.page); // Refresh user list
        } catch (error) {
            console.error("Failed to update user", error);
            alert('Failed to update user');
        }
    };

    const handleLogout = () => {
        api.auth.clearTokens();
        navigate('/login');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
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
                    <a href="/admin/users" className="nav-item active">
                        <UsersIcon size={20} />
                        <span>Người dùng</span>
                    </a>
                    <a href="/admin/parking-lots" className="nav-item">
                        <MapPin size={20} />
                        <span>Bãi đỗ xe</span>
                    </a>
                    <a href="/admin/bookings" className="nav-item">
                        <Calendar size={20} />
                        <span>Đặt chỗ</span>
                    </a>
                    <a href="/admin/reviews" className="nav-item">
                        <MessageSquare size={20} />
                        <span>Đánh giá</span>
                    </a>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <h1>User Management</h1>
                    <div className="user-menu">
                        <span className="welcome">Welcome, Admin</span>
                        <div className="avatar">A</div>
                    </div>
                </header>

                <div className="content-section">
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>All Users</h2>
                    </div>

                    {loading ? (
                        <div className="admin-loading" style={{ height: '300px' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Contact</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map((user) => (
                                                <tr key={user.userId}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div className="avatar" style={{ width: '30px', height: '30px', fontSize: '12px' }}>
                                                                {user.fullName?.charAt(0) || 'U'}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: '500' }}>{user.fullName}</div>
                                                                <div style={{ fontSize: '12px', color: '#000000' }}>ID: {user.userId.substring(0, 8)}...</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                                                <Mail size={14} color="#6b7280" /> {user.email}
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                                                <Phone size={14} color="#6b7280" /> {user.phone}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${user.roleName === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}
                                                            style={{ color: user.roleName === 'Admin' ? '#6b21a8' : '#374151', backgroundColor: user.roleName === 'Admin' ? '#f3e8ff' : '#f3f4f6' }}>
                                                            {user.roleName}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${user.isActive ? 'payment' : 'error'}`}>
                                                            {user.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(user.createdAt)}</td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleEditClick(user)}
                                                            className="action-btn"
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000000' }}
                                                        >
                                                            <MoreVertical size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">No users found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="pagination" style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px', gap: '10px', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#000000' }}>
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                    disabled={pagination.page <= 1}
                                    style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px', background: 'white', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer' }}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                    disabled={pagination.page >= pagination.totalPages}
                                    style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px', background: 'white', cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer' }}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Update User Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '24px',
                            width: '90%',
                            maxWidth: '500px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#000000' }}>Update User</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateUser}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#000000' }}>Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#000000' }}>Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Active</span>
                                    </label>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{
                                            padding: '10px 20px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            background: 'white',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '10px 20px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            background: '#2563eb',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Update User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Users;
