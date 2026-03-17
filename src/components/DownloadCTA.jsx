import React from 'react';
import { Download, Star, CheckCircle, Smartphone } from 'lucide-react';
import '../styles/DownloadCTA.css';

const DownloadCTA = () => {
    return (
        <section className="download-cta-section">
            {/* Background decorations */}
            <div className="cta-bg-orb cta-orb-1" />
            <div className="cta-bg-orb cta-orb-2" />
            <div className="cta-grid-lines" />

            <div className="container">
                <div className="download-content">
                    {/* Left: text */}
                    <div className="download-text">
                        <div className="badge-container">
                            <span className="trending-badge">
                                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                Trending #1 Parking App
                            </span>
                        </div>

                        <h2 className="download-title">
                            Tải Synergy<br />
                            <span className="gradient-text">Bắt đầu kiếm tiền ngay!</span>
                        </h2>

                        <p className="download-description">
                            Miễn phí 100% · Không phí ẩn · Hoa hồng thấp nhất thị trường.<br />
                            Hơn 10,000+ downloads trong tháng đầu!
                        </p>

                        <ul className="feature-checklist">
                            {['Đăng tin miễn phí', 'Cancellation policy linh hoạt', 'Thu tiền ngay sau mỗi booking'].map((item, i) => (
                                <li key={i}>
                                    <CheckCircle size={16} className="check-icon" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="download-buttons">
                            <a
                                href="https://apkpure.com/p/com.truongduyyyy.baigiuxethongminh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="download-btn android-apk"
                            >
                                <div className="btn-icon"><Smartphone size={22} /></div>
                                <div className="btn-text">
                                    <span className="btn-label">Tải ngay</span>
                                    <span className="btn-store">Android APK</span>
                                </div>
                            </a>
                            <div className="download-btn ios-coming">
                                <div className="btn-icon"><Download size={22} /></div>
                                <div className="btn-text">
                                    <span className="btn-label">Sắp có</span>
                                    <span className="btn-store">iOS App</span>
                                </div>
                                <span className="coming-soon-tag">Coming soon</span>
                            </div>
                        </div>

                        <div className="stats-row">
                            <div className="stat-item-cta">
                                <strong>4.8★</strong><span>App Rating</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat-item-cta">
                                <strong>10K+</strong><span>Downloads</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat-item-cta">
                                <strong>100%</strong><span>Miễn phí</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: visual */}
                    <div className="download-visual">
                        <div className="cta-phone-wrap">
                            <div className="cta-phone-glow" />
                            <div className="cta-notification notif-1">
                                <span className="notif-icon">🔔</span>
                                <div>
                                    <div className="notif-title">Booking mới!</div>
                                    <div className="notif-sub">Nguyễn Văn A · 2 giờ · 30,000đ</div>
                                </div>
                            </div>
                            <div className="cta-notification notif-2">
                                <span className="notif-icon">💰</span>
                                <div>
                                    <div className="notif-title">Thanh toán thành công</div>
                                    <div className="notif-sub">+25,000đ vào ví Synergy</div>
                                </div>
                            </div>
                            <div className="cta-phone-circle">
                                <Smartphone size={140} strokeWidth={1} color="white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DownloadCTA;
