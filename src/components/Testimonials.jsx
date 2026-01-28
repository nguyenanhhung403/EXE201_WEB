import React from 'react';
import { Star, User } from 'lucide-react';
import '../styles/Testimonials.css';

const testimonialsData = [
    {
        name: "Nguyễn Văn Minh",
        role: "Host - Quận 1",
        review: "Sân nhà rỗi giờ kiếm được 3-4 triệu/tháng! Setup dễ dàng, thu tiền linh hoạt. Recommend cho ai có đất trống.",
        rating: 5,
        avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+Minh&background=667eea&color=fff&size=128"
    },
    {
        name: "Trần Thị Hương",
        role: "Driver - Tân Bình",
        review: "Đỗ gần công ty chỉ 8k/giờ, rẻ hơn bãi xe công cộng nhiều! Chủ nhà thân thiện, sân rộng an toàn.",
        rating: 5,
        avatar: "https://ui-avatars.com/api/?name=Tran+Thi+Huong&background=f5576c&color=fff&size=128"
    },
    {
        name: "Lê Quốc Bảo",
        role: "Host - Quận 7",
        review: "App quản lý booking dễ dàng, nhận thông báo realtime. Driver đúng giờ, lịch sự. Thu nhập thụ động tuyệt vời!",
        rating: 5,
        avatar: "https://ui-avatars.com/api/?name=Le+Quoc+Bao&background=10b981&color=fff&size=128"
    },
    {
        name: "Phạm Thu Ngân",
        role: "Driver - Bình Thạnh",
        review: "Tìm chỗ đỗ gần Vinhomes trong 30s! Giá cả minh bạch, không phí ẩn. Best app đỗ xe P2P!",
        rating: 5,
        avatar: "https://ui-avatars.com/api/?name=Pham+Thu+Ngan&background=8b5cf6&color=fff&size=128"
    },
    {
        name: "Hoàng Minh Tuấn",
        role: "Both - Quận 3",
        review: "Vừa là Host vừa Driver. Kiếm tiền từ sân nhà, đỗ xe giá rẻ khi đi làm. Win-win!",
        rating: 5,
        avatar: "https://ui-avatars.com/api/?name=Hoang+Minh+Tuan&background=ec4899&color=fff&size=128"
    },
    {
        name: "Võ Thị Mai",
        role: "Host - Tân Phú",
        review: "Garage nhà cho thuê 2 chỗ, thu 5tr/tháng không làm gì. Customer support app rất nhiệt tình!",
        rating: 5,
        avatar: "https://ui-avatars.com/api/?name=Vo+Thi+Mai&background=06b6d4&color=fff&size=128"
    }
];

const Testimonials = () => {
    return (
        <section id="testimonials" className="testimonials-section">
            <div className="container">
                <h2 className="testimonials-title">Cộng đồng Synergy nói gì?</h2>
                <p className="testimonials-subtitle">Hơn 5,000+ Hosts và Drivers tin tưởng sử dụng mỗi ngày</p>

                <div className="testimonials-grid">
                    {testimonialsData.map((testimonial, index) => (
                        <div className="testimonial-card" key={index}>
                            <div className="testimonial-header">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="testimonial-avatar-img"
                                />
                                <div className="testimonial-info">
                                    <h3 className="testimonial-name">{testimonial.name}</h3>
                                    <p className="testimonial-role">{testimonial.role}</p>
                                </div>
                            </div>
                            <div className="testimonial-rating">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                                ))}
                            </div>
                            <p className="testimonial-review">"{testimonial.review}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
