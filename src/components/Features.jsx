import React from 'react';
import { MapPin, CreditCard, Clock, Shield } from 'lucide-react';
import '../styles/Features.css';

const featuresData = [
    {
        icon: <MapPin size={32} color="#06b6d4" />,
        title: "Cho Host: Kiếm tiền từ sân nhà",
        desc: "Biến khoảng đất trống thành nguồn thu nhập. Đăng tin miễn phí, host tự set giá và khung giờ rảnh."
    },
    {
        icon: <CreditCard size={32} color="#ec4899" />,
        title: "Cho Driver: Giá rẻ hơn bãi xe",
        desc: "Tìm chỗ đỗ cộng đồng giá ưu đãi gần bạn. Thanh toán linh hoạt: tiền mặt hoặc chuyển khoản."
    },
    {
        icon: <Clock size={32} color="#8b5cf6" />,
        title: "Booking nhanh, đơn giản",
        desc: "Đặt chỗ chỉ 3 giây. Host nhận thông báo ngay. Driver được dẫn đường chính xác."
    },
    {
        icon: <Shield size={32} color="#10b981" />,
        title: "Cộng đồng đánh giá, tin cậy",
        desc: "Hệ thống review 5 sao giúp host và driver xây dựng uy tín lẫn nhau."
    }
];

const Features = () => {
    return (
        <section id="features" className="features-section">
            <div className="container">
                <h2 className="section-title">Tại sao chọn Synergy?</h2>
                <p className="section-subtitle">Nền tảng chia sẻ chỗ đỗ xe đầu tiên tại Việt Nam - Kết nối cộng đồng, chia sẻ lợi ích</p>

                {/* Optional: Layout with image side-by-side or top/bottom */}
                <div className="features-content-wrapper">
                    <div className="features-grid">
                        {featuresData.map((feature, index) => (
                            <div className="glass-card feature-card" key={index}>
                                <div className="feature-icon-wrapper">
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
