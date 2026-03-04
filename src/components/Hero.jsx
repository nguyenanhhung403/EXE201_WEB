import React, { useEffect, useRef } from 'react';
import { Download, ChevronRight, MapPin, Star, Shield, Zap, Smartphone } from 'lucide-react';
import '../styles/Hero.css';

const Hero = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.1,
        }));

        let animId;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(167,139,250,${p.alpha})`;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });
            animId = requestAnimationFrame(draw);
        };
        draw();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <section id="hero" className="hero-section">
            <canvas ref={canvasRef} className="hero-canvas" />

            {/* Ambient glow orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            <div className="container hero-content">
                {/* Left: Text */}
                <div className="hero-text">
                    <div className="hero-badge">
                        <Zap size={14} />
                        <span>Nền tảng P2P Parking #1 Việt Nam</span>
                    </div>

                    <h1>
                        Cho thuê sân nhà,<br />
                        <span className="highlight">Kiếm tiền<br />thụ động</span>
                    </h1>

                    <p>
                        Synergy kết nối chủ nhà có sân trống với tài xế cần chỗ đỗ.
                        Kiếm thêm thu nhập, tiết kiệm chi phí — đơn giản, an toàn, cộng đồng!
                    </p>

                    <div className="hero-buttons">
                        <a
                            href="https://expo.dev/accounts/truongduyyyy/projects/bai-giu-xe-thong-minh/builds/dc546f52-113e-43e4-b956-64d934d7ca19"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary-glow icon-btn"
                        >
                            <Smartphone size={18} /> Tải APK Android
                        </a>
                        <a href="#features" className="btn btn-glass icon-btn">
                            <ChevronRight size={18} /> Tìm hiểu thêm
                        </a>
                    </div>

                    <div className="hero-trust">
                        <div className="trust-avatars">
                            {['M', 'T', 'B', 'H', 'L'].map((l, i) => (
                                <div key={i} className="trust-avatar" style={{ zIndex: 5 - i }}>{l}</div>
                            ))}
                        </div>
                        <div className="trust-text">
                            <div className="trust-stars">
                                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#fbbf24" color="#fbbf24" />)}
                            </div>
                            <span>5,000+ Hosts & Drivers tin tưởng</span>
                        </div>
                    </div>

                    <div className="stats">
                        <div className="stat-item">
                            <h3>100+</h3>
                            <span>Chỗ đỗ Synergy</span>
                        </div>
                        <div className="stats-divider" />
                        <div className="stat-item">
                            <h3>5k+</h3>
                            <span>Host & Driver</span>
                        </div>
                        <div className="stats-divider" />
                        <div className="stat-item">
                            <h3>4.8 ★</h3>
                            <span>Đánh giá</span>
                        </div>
                    </div>
                </div>

                {/* Right: Phone mockup + floating cards */}
                <div className="hero-image">
                    {/* Floating feature chips */}
                    <div className="float-chip chip-top-left">
                        <Shield size={16} color="#10b981" />
                        <span>Thanh toán an toàn</span>
                    </div>
                    <div className="float-chip chip-top-right">
                        <MapPin size={16} color="#f59e0b" />
                        <span>Định vị realtime</span>
                    </div>
                    <div className="float-chip chip-bottom">
                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                        <span>4.8 · 5,000+ đánh giá</span>
                    </div>

                    <div className="mobile-mockup">
                        <div className="mobile-frame">
                            <div className="mobile-notch" />
                            <div className="mobile-screen">
                                {/* App UI content */}
                                <div className="app-ui">
                                    <div className="app-header">
                                        <div className="app-greeting">Xin chào 👋</div>
                                        <div className="app-title">Tìm chỗ đỗ gần bạn</div>
                                    </div>
                                    <div className="app-search">
                                        <MapPin size={14} />
                                        <span>Tìm theo địa điểm...</span>
                                    </div>
                                    <div className="app-map-placeholder">
                                        <div className="map-dot dot-1" />
                                        <div className="map-dot dot-2" />
                                        <div className="map-dot dot-3" />
                                        <div className="map-grid" />
                                    </div>
                                    <div className="app-card">
                                        <div className="app-card-row">
                                            <div className="app-card-icon"><MapPin size={14} /></div>
                                            <div className="app-card-info">
                                                <div className="app-card-name">Vincom Center Q.1</div>
                                                <div className="app-card-meta">230m · 15,000đ/giờ</div>
                                            </div>
                                            <div className="app-card-btn">Đặt</div>
                                        </div>
                                        <div className="app-card-row">
                                            <div className="app-card-icon"><MapPin size={14} /></div>
                                            <div className="app-card-info">
                                                <div className="app-card-name">Landmark 81</div>
                                                <div className="app-card-meta">450m · 25,000đ/giờ</div>
                                            </div>
                                            <div className="app-card-btn">Đặt</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mobile-bottom-bar" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll hint */}
            <div className="scroll-hint">
                <div className="scroll-mouse">
                    <div className="scroll-wheel" />
                </div>
                <span>Cuộn để khám phá</span>
            </div>
        </section>
    );
};

export default Hero;
