import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../services/api';

/**
 * Bảo vệ route Admin: yêu cầu đăng nhập + role Admin.
 * - Chưa đăng nhập → redirect /login
 * - Đã đăng nhập nhưng không phải Admin → redirect /
 */
const ProtectedAdminRoute = ({ children }) => {
    const location = useLocation();
    const [status, setStatus] = useState('checking'); // checking | allowed | redirect_login | redirect_home

    useEffect(() => {
        // Cookie auth: getToken() trả về null; dùng isAuthenticated (kiểm tra getUser)
        const authenticated = api.auth.isAuthenticated();
        if (!authenticated) {
            setStatus('redirect_login');
            return;
        }

        const user = api.auth.getUser();
        const role = user?.role ?? user?.roleName ?? user?.RoleName;
        if (role === 'Admin') {
            setStatus('allowed');
            return;
        }

        // Có auth nhưng không có user/role (vd: refresh trang)
        if (!user) {
            let mounted = true;
            api.auth.getProfile?.()
                .then((profile) => {
                    if (!mounted) return;
                    const r = profile?.roleName ?? profile?.role;
                    if (r === 'Admin') {
                        api.auth.saveUser?.({ ...profile, role: r });
                        setStatus('allowed');
                    } else {
                        setStatus('redirect_home');
                    }
                })
                .catch(() => { if (mounted) setStatus('redirect_home'); });
            return () => { mounted = false; };
        }

        setStatus('redirect_home');
    }, []);

    if (status === 'checking') {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                fontSize: '1rem',
                color: '#6b7280'
            }}>
                Đang kiểm tra quyền truy cập...
            </div>
        );
    }

    if (status === 'redirect_login') {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (status === 'redirect_home') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
