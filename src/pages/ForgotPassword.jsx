import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader, AlertCircle, CheckCircle, Phone } from 'lucide-react';
import api from '../services/api';
import logo from '../assets/logo.png';
import '../styles/Auth.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Request, 2: OTP + New Password
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.auth.forgotPassword({
                identifier: identifier
            });

            setSuccess('Mã OTP đã được gửi đến ' + identifier);
            setStep(2);
        } catch (err) {
            setError(err.message || 'Yêu cầu thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        // Validate password match
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Validate password strength
        if (newPassword.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự!');
            return;
        }

        setLoading(true);

        try {
            await api.auth.resetPassword({
                phoneNumber: identifier, // or email
                otp: otp,
                newPassword: newPassword
            });

            setSuccess('Đặt lại mật khẩu thành công!');

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        try {
            await api.auth.resendOtp({
                identifier: identifier
            });
            alert('Mã OTP mới đã được gửi!');
        } catch (err) {
            setError(err.message || 'Không thể gửi lại OTP. Vui lòng thử lại.');
        }
    };

    if (step === 2) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <img src={logo} alt="P2P Parking" className="auth-logo" />
                        <h1>Đặt lại mật khẩu</h1>
                        <p>Nhập mã OTP và mật khẩu mới</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="auth-success">
                            <CheckCircle size={20} />
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleResetPassword} className="auth-form">
                        <div className="form-group">
                            <label>Mã OTP</label>
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

                        <div className="form-group">
                            <label>Mật khẩu mới</label>
                            <div className="input-with-icon">
                                <Lock size={20} />
                                <input
                                    type="password"
                                    placeholder="Tối thiểu 8 ký tự"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength="8"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Xác nhận mật khẩu mới</label>
                            <div className="input-with-icon">
                                <Lock size={20} />
                                <input
                                    type="password"
                                    placeholder="Nhập lại mật khẩu"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-btn primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader size={20} className="spinner" />
                                    <span>Đang đặt lại...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    <span>Đặt lại mật khẩu</span>
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
                    <img src={logo} alt="P2P Parking" className="auth-logo" />
                    <h1>Quên mật khẩu?</h1>
                    <p>Nhập email hoặc số điện thoại để nhận mã OTP</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="auth-success">
                        <CheckCircle size={20} />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handleRequestReset} className="auth-form">
                    <div className="form-group">
                        <label>Email hoặc Số điện thoại</label>
                        <div className="input-with-icon">
                            <Mail size={20} />
                            <input
                                type="text"
                                placeholder="example@email.com hoặc 0901234567"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-btn primary" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader size={20} className="spinner" />
                                <span>Đang gửi...</span>
                            </>
                        ) : (
                            'Gửi mã OTP'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Nhớ lại mật khẩu? <Link to="/login">Đăng nhập ngay</Link>
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

export default ForgotPassword;
