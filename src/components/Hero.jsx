import React from 'react';
import { Download, ChevronRight } from 'lucide-react';
// Import your app screenshot here - replace with your actual app UI image
import appScreenshot from '../assets/app-ui-search.png';
import '../styles/Hero.css';

const Hero = () => {
    return (
        <section id="hero" className="hero-section">
            <div className="container hero-content">
                <div className="hero-text fade-in">
                    <h1>
                        Cho thuê sân nhà,<br />
                        <span className="highlight">Kiếm tiền<br />thụ động</span>
                    </h1>
                    <p>
                        Nền tảng Synergy kết nối chủ nhà có sân trống với tài xế cần chỗ đỗ. Chủ nhà kiếm thêm thu nhập, tài xế tiết kiệm chi phí. Đơn giản, an toàn, cộng đồng!
                    </p>
                    <div className="hero-buttons">
                        <button className="btn btn-primary icon-btn">
                            <Download size={20} /> App Store
                        </button>
                        <button className="btn btn-glass icon-btn">
                            <Download size={20} /> Google Play
                        </button>
                    </div>
                    <div className="stats">
                        <div className="stat-item">
                            <h3>100+</h3>
                            <span>Chỗ đỗ Synergy</span>
                        </div>
                        <div className="stat-item">
                            <h3>5k+</h3>
                            <span>Host & Driver</span>
                        </div>
                        <div className="stat-item">
                            <h3>4.8</h3>
                            <span>Đánh giá</span>
                        </div>
                    </div>
                </div>

                <div className="hero-image fade-in">
                    <div className="mobile-mockup">
                        <div className="mobile-frame">
                            <div className="mobile-notch"></div>
                            <div className="mobile-screen">
                                {/* Place your app screenshot here */}
                                {/* Uncomment below and import your image */}
                                <img src={appScreenshot} alt="App UI" className="app-screenshot" />

                                {/* Placeholder content - remove when you add real screenshot */}
                                {/* 
                                <div className="placeholder-content">
                                    <div className="placeholder-map">
                                        <div className="map-marker marker-1"></div>
                                        <div className="map-marker marker-2"></div>
                                        <div className="map-marker marker-3"></div>
                                    </div>
                                    <div className="placeholder-card">
                                        <div className="card-header"></div>
                                        <div className="card-body">
                                            <div className="card-line"></div>
                                            <div className="card-line short"></div>
                                        </div>
                                    </div>
                                </div>
                                */}
                            </div>
                            <div className="mobile-bottom-bar"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glow-effect"></div>
        </section>
    );
};

export default Hero;
