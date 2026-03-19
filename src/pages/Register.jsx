import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import logo from '../assets/logo.png';
import '../styles/Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Form, 2: OTP
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: 'Driver'
    });
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otpSentTo, setOtpSentTo] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Validate password strength
        if (formData.password.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự!');
            return;
        }

        setLoading(true);

        try {
            const response = await api.auth.registerRequest({
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
                role: formData.role
            });

            setOtpSentTo(response.phoneNumber || response.email);
            setStep(2); // Move to OTP step
        } catch (err) {
            setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.auth.verifyOtp({
                phoneNumber: formData.phoneNumber,
                otp: otp,
                verificationType: 'Registration'
            });

            // Save tokens
            api.auth.saveTokens(response.accessToken, response.refreshToken);

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Xác thực OTP thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        try {
            await api.auth.resendOtp({
                phoneNumber: formData.phoneNumber
            });
            toast.success('Mã OTP mới đã được gửi!');
        } catch (err) {
            setError(err.message || 'Không thể gửi lại OTP. Vui lòng thử lại.');
        }
    };

    if (step === 2) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <img src={logo} alt="Synergy" className="auth-logo" />
                        <h1>Xác thực OTP</h1>
                        <p>Mã OTP đã được gửi đến {otpSentTo}</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleVerifyOtp} className="auth-form">
                        <div className="form-group">
                            <label>Nhập mã OTP</label>
                            <input
                                type="text"
                                placeholder="Nhập 6 số OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                                required
                                className="otp-input"
                            />
                        </div>

                        <button type="submit" className="auth-btn primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader size={20} className="spinner" />
                                    <span>Đang xác thực...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    <span>Xác thực</span>
                                </>
                            )}
                        </button>

                        <button type="button" onClick={handleResendOtp} className="auth-btn secondary">
                            Gửi lại OTP
                        </button>
                    </form>

                    <div className="auth-footer">
                        <button onClick={() => setStep(1)} className="back-link">
                            ← Quay lại
                        </button>
                    </div>
                </div>

                <div className="auth-decoration">
                    <div className="decoration-circle"></div>
                    <div className="decoration-circle"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <img src={logo} alt="Synergy" className="auth-logo" />
                    <h1>Tạo tài khoản mới</h1>
                    <p>Bắt đầu hành trình với Synergy</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <div className="input-with-icon">
                            <User size={20} />
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Nguyễn Văn An"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <div className="input-with-icon">
                                <Mail size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="example@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <div className="input-with-icon">
                                <Phone size={20} />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="0901234567"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Vai trò</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="role-select"
                        >
                            <option value="Driver">🚗 Driver - Tài xế tìm chỗ đỗ</option>
                            <option value="Host">🏠 Host - Chủ nhà cho thuê</option>
                            <option value="Both">⭐ Both - Cả hai</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <div className="input-with-icon">
                                <Lock size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Tối thiểu 8 ký tự"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="8"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Xác nhận mật khẩu</label>
                            <div className="input-with-icon">
                                <Lock size={20} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Nhập lại mật khẩu"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input type="checkbox" required />
                            <span>
                                Tôi đồng ý với <Link to="/terms">Điều khoản dịch vụ</Link> và{' '}
                                <Link to="/privacy">Chính sách bảo mật</Link>
                            </span>
                        </label>
                    </div>

                    <button type="submit" className="auth-btn primary" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader size={20} className="spinner" />
                                <span>Đang đăng ký...</span>
                            </>
                        ) : (
                            'Đăng ký'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
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

export default Register;
