import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import logo from '../assets/logo.png';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-section">
                    <div className="footer-logo">
                        <img src={logo} alt="P2P Parking Logo" className="footer-logo-img" />
                        <h3>P2P Parking</h3>
                    </div>
                    <p>Nền tảng chia sẻ chỗ đỗ xe Peer-to-Peer đầu tiên tại Việt Nam.</p>
                </div>

                <div className="footer-section">
                    <h4>Liên kết</h4>
                    <ul>
                        <li><a href="#hero">Trang chủ</a></li>
                        <li><a href="#features">Tính năng</a></li>
                        <li><a href="#download">Tải App</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Hỗ trợ</h4>
                    <ul>
                        <li><Link to="/help-center">Trung tâm trợ giúp</Link></li>
                        <li><Link to="/terms">Điều khoản sử dụng</Link></li>
                        <li><Link to="/privacy">Chính sách bảo mật</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Kết nối</h4>
                    <div className="social-icons">
                        <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                        <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                        <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                        <a href="#" aria-label="Email"><Mail size={20} /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; 2026 P2P Parking. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
