import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import '../styles/Testimonials.css';

const testimonialsData = [
    {
        name: 'Nguyễn Văn Minh',
        role: 'Host · Quận 1',
        review: 'Sân nhà rỗi giờ kiếm được 3–4 triệu/tháng! Setup dễ dàng, thu tiền linh hoạt. Recommend cho ai có đất trống.',
        rating: 5,
        avatar: 'NM',
        color: '#667eea',
        type: 'Host',
    },
    {
        name: 'Trần Thị Hương',
        role: 'Driver · Tân Bình',
        review: 'Đỗ gần công ty chỉ 8k/giờ, rẻ hơn bãi xe công cộng nhiều! Chủ nhà thân thiện, sân rộng an toàn.',
        rating: 5,
        avatar: 'TH',
        color: '#f5576c',
        type: 'Driver',
    },
    {
        name: 'Lê Quốc Bảo',
        role: 'Host · Quận 7',
        review: 'App quản lý booking dễ dàng, nhận thông báo realtime. Driver đúng giờ, lịch sự. Thu nhập thụ động tuyệt vời!',
        rating: 5,
        avatar: 'LB',
        color: '#10b981',
        type: 'Host',
    },
    {
        name: 'Phạm Thu Ngân',
        role: 'Driver · Bình Thạnh',
        review: 'Tìm chỗ đỗ gần Vinhomes trong 30s! Giá cả minh bạch, không phí ẩn. Best app đỗ xe P2P!',
        rating: 5,
        avatar: 'PN',
        color: '#8b5cf6',
        type: 'Driver',
    },
    {
        name: 'Hoàng Minh Tuấn',
        role: 'Host & Driver · Quận 3',
        review: 'Vừa là Host vừa Driver. Kiếm tiền từ sân nhà, đỗ xe giá rẻ khi đi làm. Win-win hoàn toàn!',
        rating: 5,
        avatar: 'HT',
        color: '#ec4899',
        type: 'Host',
    },
    {
        name: 'Võ Thị Mai',
        role: 'Host · Tân Phú',
        review: 'Garage nhà cho thuê 2 chỗ, thu 5tr/tháng không làm gì. Customer support app rất nhiệt tình!',
        rating: 5,
        avatar: 'VM',
        color: '#06b6d4',
        type: 'Host',
    },
];

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!isPaused) {
            timerRef.current = setInterval(() => {
                setActiveIndex(prev => (prev + 1) % testimonialsData.length);
            }, 4000);
        }
        return () => clearInterval(timerRef.current);
    }, [isPaused]);

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="testimonials-bg-grid" />
            <div className="testimonials-orb-left" />
            <div className="testimonials-orb-right" />

            <div className="container">
                <div className="testimonials-header">
                    <div className="section-eyebrow-dark">❝ Cộng đồng nói gì?</div>
                    <h2 className="testimonials-title">
                        Hơn <span className="t-highlight">5,000+</span> người<br />tin tưởng Synergy
                    </h2>
                    <p className="testimonials-subtitle">Hosts và Drivers trên khắp TP.HCM chia sẻ trải nghiệm thực tế</p>
                </div>

                {/* Grid of cards */}
                <div
                    className="testimonials-grid"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {testimonialsData.map((t, i) => (
                        <div
                            key={i}
                            className={`testimonial-card ${i === activeIndex ? 'active' : ''}`}
                            onClick={() => setActiveIndex(i)}
                            style={{ '--card-color': t.color }}
                        >
                            <div className="t-quote-icon"><Quote size={20} /></div>

                            <div className="t-rating">
                                {[...Array(t.rating)].map((_, si) => (
                                    <Star key={si} size={14} fill="#fbbf24" color="#fbbf24" />
                                ))}
                            </div>

                            <p className="t-review">"{t.review}"</p>

                            <div className="t-author">
                                <div className="t-avatar" style={{ background: t.color }}>{t.avatar}</div>
                                <div className="t-info">
                                    <div className="t-name">{t.name}</div>
                                    <div className="t-role">{t.role}</div>
                                </div>
                                <span className={`t-type-badge ${t.type === 'Host' ? 'host' : 'driver'}`}>{t.type}</span>
                            </div>

                            <div className="t-card-glow" />
                        </div>
                    ))}
                </div>

                {/* Dot indicators */}
                <div className="t-dots">
                    {testimonialsData.map((_, i) => (
                        <button
                            key={i}
                            className={`t-dot ${i === activeIndex ? 'active' : ''}`}
                            onClick={() => setActiveIndex(i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
