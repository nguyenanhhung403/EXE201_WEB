import React from 'react';
import { Users, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
    const hostSteps = [
        {
            icon: <MapPin size={32} />,
            title: "Đăng chỗ đỗ",
            description: "Post sân/garage trống của bạn lên app, set giá và khung giờ rảnh"
        },
        {
            icon: <Users size={32} />,
            title: "Nhận booking",
            description: "Driver tìm và đặt chỗ, bạn nhận thông báo ngay lập tức"
        },
        {
            icon: <DollarSign size={32} />,
            title: "Nhận tiền",
            description: "Thu tiền mặt/chuyển khoản, hoặc qua ví app. Kiếm thêm thu nhập thụ động!"
        }
    ];

    const driverSteps = [
        {
            icon: <MapPin size={32} />,
            title: "Tìm chỗ đỗ",
            description: "Xem bản đồ các chỗ đỗ P2P gần bạn, giá rẻ hơn bãi xe"
        },
        {
            icon: <CheckCircle size={32} />,
            title: "Đặt chỗ nhanh",
            description: "Book trong 3 giây, nhận directions đến chỗ đỗ"
        },
        {
            icon: <DollarSign size={32} />,
            title: "Thanh toán & Đánh giá",
            description: "Trả tiền linh hoạt, rate 5 sao để xây dựng uy tín"
        }
    ];

    return (
        <section id="how-it-works" className="how-it-works-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Làm sao hoạt động?</h2>
                    <p className="section-subtitle">Synergy kết nối chủ nhà và tài xế trong 3 bước đơn giản</p>
                </div>

                <div className="roles-container">
                    {/* For Hosts */}
                    <div className="role-column">
                        <div className="role-header">
                            <div className="role-badge host">Cho Host</div>
                            <h3>Biến sân nhà thành ATM</h3>
                        </div>
                        <div className="steps-list">
                            {hostSteps.map((step, index) => (
                                <div className="step-card" key={index}>
                                    <div className="step-number">{index + 1}</div>
                                    <div className="step-icon host-color">{step.icon}</div>
                                    <div className="step-content">
                                        <h4>{step.title}</h4>
                                        <p>{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* For Drivers */}
                    <div className="role-column">
                        <div className="role-header">
                            <div className="role-badge driver">Cho Driver</div>
                            <h3>Đỗ xe giá rẻ, gần nhà</h3>
                        </div>
                        <div className="steps-list">
                            {driverSteps.map((step, index) => (
                                <div className="step-card" key={index}>
                                    <div className="step-number">{index + 1}</div>
                                    <div className="step-icon driver-color">{step.icon}</div>
                                    <div className="step-content">
                                        <h4>{step.title}</h4>
                                        <p>{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
