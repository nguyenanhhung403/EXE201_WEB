import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SupportPages.css';

const Privacy = () => {
    return (
        <div className="support-page">
            <div className="container">
                <Link to="/" className="back-link">← Quay lại trang chủ</Link>

                <h1 className="page-title">Chính sách Bảo mật</h1>
                <p className="last-updated">Cập nhật lần cuối: 25/01/2026</p>

                <div className="privacy-content">
                    <section>
                        <h2>1. Giới thiệu</h2>
                        <p>Synergy cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Chính sách Bảo mật này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi bạn sử dụng ứng dụng của chúng tôi.</p>
                    </section>

                    <section>
                        <h2>2. Thông tin Chúng tôi Thu thập</h2>

                        <h3>2.1. Thông tin Cá nhân</h3>
                        <ul>
                            <li>Họ tên</li>
                            <li>Số điện thoại</li>
                            <li>Địa chỉ email</li>
                            <li>Thông tin thanh toán (được mã hóa và bảo mật)</li>
                        </ul>

                        <h3>2.2. Thông tin Vị trí</h3>
                        <p>Chúng tôi thu thập dữ liệu vị trí của bạn để:</p>
                        <ul>
                            <li>Hiển thị các bãi đỗ xe gần bạn</li>
                            <li>Cung cấp chỉ dẫn đường đi</li>
                            <li>Cải thiện trải nghiệm người dùng</li>
                        </ul>

                        <h3>2.3. Thông tin Sử dụng</h3>
                        <ul>
                            <li>Lịch sử đặt chỗ và giao dịch</li>
                            <li>Thời gian sử dụng ứng dụng</li>
                            <li>Thiết bị và phiên bản hệ điều hành</li>
                            <li>Địa chỉ IP</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Cách Chúng tôi Sử dụng Thông tin</h2>
                        <p>Thông tin của bạn được sử dụng để:</p>
                        <ul>
                            <li>Cung cấp và cải thiện dịch vụ</li>
                            <li>Xử lý giao dịch và thanh toán</li>
                            <li>Gửi thông báo về đặt chỗ và giao dịch</li>
                            <li>Hỗ trợ khách hàng</li>
                            <li>Phân tích và cải thiện ứng dụng</li>
                            <li>Tuân thủ các yêu cầu pháp lý</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Chia sẻ Thông tin</h2>
                        <p>Chúng tôi có thể chia sẻ thông tin của bạn với:</p>

                        <h3>4.1. Đối tác Bãi đỗ xe</h3>
                        <p>Thông tin cần thiết để xử lý đặt chỗ (tên, biển số xe, thời gian).</p>

                        <h3>4.2. Nhà cung cấp Dịch vụ</h3>
                        <p>Các bên thứ ba hỗ trợ xử lý thanh toán, phân tích dữ liệu (tuân thủ nghiêm ngặt về bảo mật).</p>

                        <h3>4.3. Yêu cầu Pháp lý</h3>
                        <p>Khi được yêu cầu bởi cơ quan chức năng theo quy định pháp luật.</p>

                        <p><strong>Lưu ý:</strong> Chúng tôi KHÔNG bán thông tin cá nhân của bạn cho bên thứ ba.</p>
                    </section>

                    <section>
                        <h2>5. Bảo mật Thông tin</h2>
                        <p>Chúng tôi áp dụng các biện pháp bảo mật tiên tiến:</p>
                        <ul>
                            <li>Mã hóa SSL/TLS cho truyền tải dữ liệu</li>
                            <li>Mã hóa dữ liệu nhạy cảm trong cơ sở dữ liệu</li>
                            <li>Xác thực hai yếu tố (2FA) tùy chọn</li>
                            <li>Kiểm tra bảo mật định kỳ</li>
                            <li>Giới hạn quyền truy cập nội bộ</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Quyền của Bạn</h2>
                        <p>Bạn có quyền:</p>
                        <ul>
                            <li><strong>Truy cập:</strong> Xem thông tin cá nhân chúng tôi lưu trữ</li>
                            <li><strong>Chỉnh sửa:</strong> Cập nhật thông tin không chính xác</li>
                            <li><strong>Xóa:</strong> Yêu cầu xóa tài khoản và dữ liệu</li>
                            <li><strong>Từ chối:</strong> Không đồng ý với việc xử lý dữ liệu nhất định</li>
                            <li><strong>Di chuyển:</strong> Yêu cầu sao chép dữ liệu của bạn</li>
                        </ul>
                        <p>Để thực hiện các quyền này, vui lòng liên hệ: privacy@synergy.vn</p>
                    </section>

                    <section>
                        <h2>7. Cookies và Công nghệ Theo dõi</h2>
                        <p>Chúng tôi sử dụng cookies và công nghệ tương tự để:</p>
                        <ul>
                            <li>Ghi nhớ tùy chọn của bạn</li>
                            <li>Phân tích lưu lượng truy cập</li>
                            <li>Cải thiện hiệu suất ứng dụng</li>
                        </ul>
                        <p>Bạn có thể quản lý cookies trong cài đặt trình duyệt.</p>
                    </section>

                    <section>
                        <h2>8. Trẻ em</h2>
                        <p>Ứng dụng không dành cho người dưới 16 tuổi. Chúng tôi không cố ý thu thập thông tin từ trẻ em. Nếu bạn phát hiện trẻ em đã cung cấp thông tin, vui lòng liên hệ ngay.</p>
                    </section>

                    <section>
                        <h2>9. Thay đổi Chính sách</h2>
                        <p>Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian. Các thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo trong ứng dụng.</p>
                    </section>

                    <section>
                        <h2>10. Liên hệ</h2>
                        <p>Nếu bạn có câu hỏi về Chính sách Bảo mật, vui lòng liên hệ:</p>
                        <p><strong>Email:</strong> privacy@synergy.vn</p>
                        <p><strong>Hotline:</strong> 1900-xxxx</p>
                        <p><strong>Địa chỉ:</strong> 123 Nguyễn Huệ, Quận 1, TP.HCM</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
