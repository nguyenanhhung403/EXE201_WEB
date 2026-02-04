import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './styles/global.css';

// Components
import ScrollToTop from './components/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import HelpCenter from './pages/HelpCenter';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';
import Users from './pages/Users';
import ParkingLots from './pages/ParkingLots';
import Bookings from './pages/Bookings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import OwnerRequestsManagement from './pages/OwnerRequestsManagement';
import Reviews from './pages/Reviews';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/parking-lots" element={<ParkingLots />} />
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/owner-requests" element={<OwnerRequestsManagement />} />
          <Route path="/admin/reviews" element={<Reviews />} />
          <Route path="/admin/transactions" element={<Transactions />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
