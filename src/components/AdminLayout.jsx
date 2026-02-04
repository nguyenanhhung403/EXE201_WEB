import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Users, MapPin, Calendar, LogOut, Activity, MessageSquare, Menu, Receipt, BarChart } from 'lucide-react';
import api from '../services/api';
import '../styles/Admin.css';

const AdminLayout = ({ children, title, subtitle }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        api.auth.clearTokens();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>SmartParking</h2>
                    <span className="badge">Admin</span>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/admin" className={`nav-item ${isActive('/admin')}`}>
                        <Activity size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/users" className={`nav-item ${isActive('/admin/users')}`}>
                        <Users size={20} />
                        <span>Người dùng</span>
                    </Link>
                    <Link to="/admin/parking-lots" className={`nav-item ${isActive('/admin/parking-lots')}`}>
                        <MapPin size={20} />
                        <span>Bãi đỗ xe</span>
                    </Link>
                    <Link to="/admin/bookings" className={`nav-item ${isActive('/admin/bookings')}`}>
                        <Calendar size={20} />
                        <span>Đặt chỗ</span>
                    </Link>
                    <Link to="/admin/owner-requests" className={`nav-item ${isActive('/admin/owner-requests')}`}>
                        <Activity size={20} />
                        <span>Yêu cầu làm chủ bãi</span>
                    </Link>
                    <Link to="/admin/reviews" className={`nav-item ${isActive('/admin/reviews')}`}>
                        <MessageSquare size={20} />
                        <span>Đánh giá</span>
                    </Link>
                    <Link to="/admin/transactions" className={`nav-item ${isActive('/admin/transactions')}`}>
                        <Receipt size={20} />
                        <span>Giao dịch</span>
                    </Link>
                    <Link to="/admin/reports" className={`nav-item ${isActive('/admin/reports')}`}>
                        <BarChart size={20} />
                        <span>Báo cáo</span>
                    </Link>
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
                    <div>
                        <h1>{title}</h1>
                        {subtitle && <p className="subtitle" style={{ color: '#6b7280' }}>{subtitle}</p>}
                    </div>
                    <div className="user-menu">
                        <div className="avatar">A</div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
