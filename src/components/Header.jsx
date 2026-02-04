import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';
import '../styles/Header.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''} `}>
            <div className="container header-content">
                <div className="logo">
                    <img src={logo} alt="Synergy Logo" className="logo-img" />
                    <span>Synergy</span>
                </div>

                <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <a href="#hero" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</a>
                    <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Tính năng</a>
                    <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>Cách hoạt động</a>
                    <a href="#download" onClick={() => setIsMobileMenuOpen(false)}>Tải App</a>
                    <Link to="/login" className="login-btn" onClick={() => setIsMobileMenuOpen(false)}>Đăng nhập</Link>
                </nav>

                <div className="header-actions">
                    <a href="#download" className="btn btn-primary desktop-cta">Tải ngay</a>
                    <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
