import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader, AlertCircle } from 'lucide-react';
import api from '../services/api';
import logo from '../assets/logo.png';
import '../styles/Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.auth.login(formData);

            // Save tokens
            api.auth.saveTokens(response.accessToken, response.refreshToken);

            // Redirect based on role
            if (response.user.role === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <img src={logo} alt="Synergy" className="auth-logo" />
                    <h1>Chào mừng trở lại!</h1>
                    <p>Đăng nhập để tiếp tục với Synergy</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email hoặc Số điện thoại</label>
                        <div className="input-with-icon">
                            <Mail size={20} />
                            <input
                                type="text"
                                name="identifier"
                                placeholder="nguyenvanan@email.com hoặc 0901234567"
                                value={formData.identifier}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <div className="input-with-icon">
                            <Lock size={20} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="checkbox-label">
                            <input type="checkbox" />
                            <span>Ghi nhớ đăng nhập</span>
                        </label>
                        <Link to="/forgot-password" className="forgot-link">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button type="submit" className="auth-btn primary" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader size={20} className="spinner" />
                                <span>Đang đăng nhập...</span>
                            </>
                        ) : (
                            'Đăng nhập'
                        )}
                    </button>
                </form>



                <div className="auth-footer">
                    <p>
                        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>

            <div className="auth-decoration">
                <div className="decoration-circle"></div>
                <div className="decoration-circle"></div>
            </div>
        </div>
    );
};

export default Login;
