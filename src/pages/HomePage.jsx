import React from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import DownloadCTA from '../components/DownloadCTA';
import Footer from '../components/Footer';

const HomePage = () => {
    return (
        <div className="app">
            <SEO
                title="Synergy - Chia sẻ chỗ đỗ xe P2P | Cho thuê sân nhà kiếm tiền thụ động"
                description="Biến sân nhà thành nguồn thu thụ động! Chủ nhà cho thuê chỗ đỗ, tài xế tìm chỗ đỗ giá rẻ. Nền tảng Synergy kết nối cộng đồng chia sẻ chỗ đỗ xe tại Việt Nam."
            />
            <Header />
            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <Testimonials />
                <DownloadCTA />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
