import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SupportPages.css';

const Terms = () => {
    return (
        <div className="support-page">
            <div className="container">
                <Link to="/" className="back-link">← Quay lại trang chủ</Link>

                <h1 className="page-title">Điều khoản Sử dụng</h1>
                <p className="last-updated">Cập nhật lần cuối: 25/01/2026</p>

                <div className="terms-content">
                    <section>
                        <h2>1. Chấp nhận Điều khoản</h2>
                        <p>Bằng việc truy cập và sử dụng ứng dụng Synergy ("Ứng dụng"), bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sau đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng Ứng dụng.</p>
                    </section>

                    <section>
                        <h2>2. Mô tả Dịch vụ</h2>
                        <p>Synergy cung cấp nền tảng kết nối người dùng với các bãi đỗ xe thông qua ứng dụng di động. Dịch vụ bao gồm:</p>
                        <ul>
                            <li>Tìm kiếm và hiển thị thông tin bãi đỗ xe</li>
                            <li>Đặt chỗ đỗ xe trước</li>
                            <li>Thanh toán điện tử</li>
                            <li>Dẫn đường đến bãi đỗ xe</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Tài khoản Người dùng</h2>
                        <p>Để sử dụng Ứng dụng, bạn cần:</p>
                        <ul>
                            <li>Đăng ký tài khoản với thông tin chính xác và đầy đủ</li>
                            <li>Bảo mật thông tin đăng nhập của bạn</li>
                            <li>Chịu trách nhiệm về mọi hoạt động diễn ra dưới tài khoản của bạn</li>
                            <li>Thông báo ngay cho chúng tôi nếu phát hiện sử dụng trái phép</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Quy định Sử dụng</h2>
                        <p>Khi sử dụng Ứng dụng, bạn đồng ý:</p>
                        <ul>
                            <li>Không sử dụng Ứng dụng cho mục đích bất hợp pháp</li>
                            <li>Không can thiệp vào hoạt động của Ứng dụng</li>
                            <li>Không sao chép, sửa đổi hoặc phân phối nội dung mà không có sự cho phép</li>
                            <li>Tuân thủ mọi quy định pháp luật hiện hành</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Thanh toán và Hoàn tiền</h2>
                        <p><strong>Thanh toán:</strong> Bạn đồng ý thanh toán đầy đủ các khoản phí liên quan đến việc sử dụng dịch vụ đỗ xe.</p>
                        <p><strong>Hoàn tiền:</strong> Chính sách hoàn tiền áp dụng trong các trường hợp:</p>
                        <ul>
                            <li>Hủy đặt chỗ trước 15 phút: Hoàn 100%</li>
                            <li>Lỗi từ hệ thống: Hoàn 100%</li>
                            <li>Bãi đỗ hết chỗ khi đã đặt: Hoàn 100%</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Trách nhiệm và Giới hạn</h2>
                        <p>Synergy không chịu trách nhiệm về:</p>
                        <ul>
                            <li>Thiệt hại đối với xe của bạn trong bãi đỗ (trách nhiệm thuộc về chủ bãi)</li>
                            <li>Sự gián đoạn dịch vụ do sự cố kỹ thuật</li>
                            <li>Thông tin không chính xác từ bên thứ ba</li>
                        </ul>
                    </section>

                    <section>
                        <h2>7. Quyền Sở hữu Trí tuệ</h2>
                        <p>Mọi nội dung, logo, giao diện, và tài liệu liên quan đến Ứng dụng đều thuộc quyền sở hữu của Synergy. Bạn không được sao chép, sửa đổi hoặc sử dụng mà không có sự cho phép bằng văn bản.</p>
                    </section>

                    <section>
                        <h2>8. Thay đổi Điều khoản</h2>
                        <p>Chúng tôi có quyền thay đổi các Điều khoản này bất kỳ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên Ứng dụng. Việc bạn tiếp tục sử dụng Ứng dụng sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.</p>
                    </section>

                    <section>
                        <h2>9. Chấm dứt</h2>
                        <p>Chúng tôi có quyền tạm ngưng hoặc chấm dứt quyền truy cập của bạn vào Ứng dụng nếu bạn vi phạm các Điều khoản này hoặc pháp luật hiện hành.</p>
                    </section>

                    <section>
                        <h2>10. Liên hệ</h2>
                        <p>Nếu bạn có bất kỳ câu hỏi nào về Điều khoản Sử dụng, vui lòng liên hệ:</p>
                        <p><strong>Email:</strong> legal@synergy.vn</p>
                        <p><strong>Hotline:</strong> 1900-xxxx</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
