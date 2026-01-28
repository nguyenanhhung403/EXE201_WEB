import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SupportPages.css';

const HelpCenter = () => {
    return (
        <div className="support-page">
            <div className="container">
                <Link to="/" className="back-link">← Quay lại trang chủ</Link>

                <h1 className="page-title">Trung tâm Trợ giúp</h1>

                <div className="help-sections">
                    <div className="help-section">
                        <h2>Câu hỏi thường gặp (FAQ)</h2>

                        <div className="faq-item">
                            <h3>Làm thế nào để tìm chỗ đỗ xe?</h3>
                            <p>Mở ứng dụng Synergy, cho phép truy cập vị trí, và bản đồ sẽ hiển thị các bãi đỗ xe gần bạn nhất. Bạn có thể xem thông tin chi tiết như giá cả, số chỗ trống và khoảng cách.</p>
                        </div>

                        <div className="faq-item">
                            <h3>Làm sao để đặt chỗ trước?</h3>
                            <p>Chọn bãi đỗ xe trên bản đồ, nhấn "Đặt chỗ", chọn thời gian bắt đầu và kết thúc, sau đó xác nhận đặt chỗ. Bạn sẽ nhận được mã QR để check-in.</p>
                        </div>

                        <div className="faq-item">
                            <h3>Các phương thức thanh toán được hỗ trợ?</h3>
                            <p>Synergy hỗ trợ thanh toán qua thẻ tín dụng/ghi nợ, ví điện tử (MoMo, ZaloPay, VNPay) và thanh toán tự động khi bạn rời khỏi bãi đỗ.</p>
                        </div>

                        <div className="faq-item">
                            <h3>Tôi có thể hủy đặt chỗ không?</h3>
                            <p>Có, bạn có thể hủy đặt chỗ miễn phí trước 15 phút so với thời gian bắt đầu đã đặt. Sau thời gian này, phí hủy sẽ được áp dụng theo chính sách của từng bãi đỗ.</p>
                        </div>

                        <div className="faq-item">
                            <h3>Làm sao nếu tôi gặp sự cố?</h3>
                            <p>Bạn có thể liên hệ hỗ trợ 24/7 qua:</p>
                            <ul>
                                <li>Hotline: 1900-xxxx</li>
                                <li>Email: support@synergy.vn</li>
                                <li>Chat trực tiếp trong ứng dụng</li>
                            </ul>
                        </div>
                    </div>

                    <div className="help-section">
                        <h2>Hướng dẫn sử dụng</h2>

                        <div className="tutorial-item">
                            <h3>Bước 1: Tải và Đăng ký</h3>
                            <p>Tải ứng dụng Synergy từ App Store hoặc Google Play. Đăng ký tài khoản bằng số điện thoại hoặc email.</p>
                        </div>

                        <div className="tutorial-item">
                            <h3>Bước 2: Tìm kiếm bãi đỗ</h3>
                            <p>Cho phép ứng dụng truy cập vị trí của bạn. Xem danh sách các bãi đỗ gần nhất hoặc tìm kiếm theo địa điểm cụ thể.</p>
                        </div>

                        <div className="tutorial-item">
                            <h3>Bước 3: Đặt chỗ và Thanh toán</h3>
                            <p>Chọn bãi đỗ phù hợp, đặt chỗ trước hoặc check-in trực tiếp. Thanh toán tự động khi bạn rời khỏi bãi.</p>
                        </div>
                    </div>

                    <div className="help-section">
                        <h2>Liên hệ Hỗ trợ</h2>
                        <div className="contact-info">
                            <p><strong>Email:</strong> support@synergy.vn</p>
                            <p><strong>Hotline:</strong> 1900-xxxx (24/7)</p>
                            <p><strong>Địa chỉ:</strong> 123 Nguyễn Huệ, Quận 1, TP.HCM</p>
                            <p><strong>Giờ làm việc:</strong> Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
