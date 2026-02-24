import React from 'react';
import { MapPin, CreditCard, Clock, Shield, TrendingUp, Zap } from 'lucide-react';
import '../styles/Features.css';

const featuresData = [
    {
        icon: MapPin,
        color: '#06b6d4',
        bg: 'rgba(6,182,212,0.12)',
        badge: 'Dành cho Host',
        title: 'Kiếm tiền từ sân nhà',
        desc: 'Biến khoảng đất trống thành nguồn thu nhập thụ động. Đăng tin miễn phí, tự set giá và khung giờ rảnh.'
    },
    {
        icon: CreditCard,
        color: '#ec4899',
        bg: 'rgba(236,72,153,0.12)',
        badge: 'Dành cho Driver',
        title: 'Giá rẻ hơn bãi xe công cộng',
        desc: 'Tìm chỗ đỗ cộng đồng giá ưu đãi gần bạn. Thanh toán linh hoạt: tiền mặt hoặc chuyển khoản.'
    },
    {
        icon: Zap,
        color: '#8b5cf6',
        bg: 'rgba(139,92,246,0.12)',
        badge: 'Nhanh chóng',
        title: 'Booking chỉ 3 giây',
        desc: 'Đặt chỗ siêu tốc, nhận xác nhận ngay lập tức. Host nhận thông báo, Driver được dẫn đường chính xác.'
    },
    {
        icon: Shield,
        color: '#10b981',
        bg: 'rgba(16,185,129,0.12)',
        badge: 'An toàn',
        title: 'Cộng đồng uy tín 5 sao',
        desc: 'Hệ thống review hai chiều giúp Host và Driver xây dựng hồ sơ uy tín, tạo nền tảng tin cậy lẫn nhau.'
    },
    {
        icon: TrendingUp,
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.12)',
        badge: 'Thu nhập',
        title: 'Thu nhập thụ động ổn định',
        desc: 'Chủ nhà trung bình kiếm 3–5 triệu/tháng chỉ từ sân trống. Mọi giao dịch được ghi nhận minh bạch.'
    },
    {
        icon: Clock,
        color: '#6366f1',
        bg: 'rgba(99,102,241,0.12)',
        badge: '24/7',
        title: 'Hỗ trợ xuyên suốt',
        desc: 'Đội ngũ hỗ trợ sẵn sàng 24/7 qua chat trong app. Mọi vấn đề được giải quyết trong vòng 15 phút.'
    }
];

const Features = () => {
    return (
        <section id="features" className="features-section">
            <div className="container">
                <div className="features-header">
                    <div className="section-eyebrow">✦ Tính năng nổi bật</div>
                    <h2 className="section-title">Tại sao chọn <span className="gradient-word">Synergy</span>?</h2>
                    <p className="section-subtitle">
                        Nền tảng chia sẻ chỗ đỗ xe P2P đầu tiên tại Việt Nam — kết nối cộng đồng, chia sẻ lợi ích
                    </p>
                </div>

                <div className="features-grid">
                    {featuresData.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div className="feature-card" key={index} style={{ '--icon-color': feature.color, '--icon-bg': feature.bg }}>
                                <div className="feature-card-inner">
                                    <div className="feature-badge-label">{feature.badge}</div>
                                    <div className="feature-icon-box">
                                        <Icon size={26} />
                                    </div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.desc}</p>
                                </div>
                                <div className="feature-card-glow" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;
