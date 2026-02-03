import React from 'react';
import { Download, Smartphone, Star } from 'lucide-react';
import '../styles/DownloadCTA.css';

const DownloadCTA = () => {
    return (
        <section className="download-cta-section">
            <div className="container">
                <div className="download-content">
                    <div className="download-text">
                        <div className="badge-container">
                            <span className="trending-badge">
                                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                                Trending #1 Parking App
                            </span>
                        </div>
                        <h2 className="download-title">
                            Tải Synergy<br />
                            <span className="gradient-text">Bắt đầu kiếm tiền ngay!</span>
                        </h2>
                        <p className="download-description">
                            Miễn phí 100%. Không phí ẩn. Hoa hồng thấp nhất thị trường.<br />
                            Hơn 10,000+ downloads trong tháng đầu!
                        </p>

                        <div className="download-buttons">
                            <a href="#" className="download-btn app-store">
                                <div className="btn-icon">
                                    <Download size={24} />
                                </div>
                                <div className="btn-text">
                                    <span className="btn-label">Download on the</span>
                                    <span className="btn-store">App Store</span>
                                </div>
                            </a>
                            <a href="#" className="download-btn google-play">
                                <div className="btn-icon">
                                    <Download size={24} />
                                </div>
                                <div className="btn-text">
                                    <span className="btn-label">Get it on</span>
                                    <span className="btn-store">Google Play</span>
                                </div>
                            </a>
                        </div>

                        <div className="stats-row">
                            <div className="stat-item-cta">
                                <strong>4.8★</strong>
                                <span>Rating</span>
                            </div>
                            <div className="stat-item-cta">
                                <strong>10K+</strong>
                                <span>Downloads</span>
                            </div>
                            <div className="stat-item-cta">
                                <strong>100%</strong>
                                <span>Free</span>
                            </div>
                        </div>
                    </div>

                    <div className="download-visual">
                        <div className="phone-mockup">
                            <Smartphone size={280} color="#6366f1" strokeWidth={1.5} />
                            <div className="phone-glow"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DownloadCTA;
