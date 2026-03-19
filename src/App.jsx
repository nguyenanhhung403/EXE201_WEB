import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import './styles/global.css';

// Components
import ScrollToTop from './components/ScrollToTop';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

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
import AdminWallet from './pages/AdminWallet';

function App() {
  return (
    <HelmetProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />
          <Route path="/admin/users" element={<ProtectedAdminRoute><Users /></ProtectedAdminRoute>} />
          <Route path="/admin/parking-lots" element={<ProtectedAdminRoute><ParkingLots /></ProtectedAdminRoute>} />
          <Route path="/admin/bookings" element={<ProtectedAdminRoute><Bookings /></ProtectedAdminRoute>} />
          <Route path="/admin/owner-requests" element={<ProtectedAdminRoute><OwnerRequestsManagement /></ProtectedAdminRoute>} />
          <Route path="/admin/reviews" element={<ProtectedAdminRoute><Reviews /></ProtectedAdminRoute>} />
          <Route path="/admin/transactions" element={<ProtectedAdminRoute><Transactions /></ProtectedAdminRoute>} />
          <Route path="/admin/wallet" element={<ProtectedAdminRoute><AdminWallet /></ProtectedAdminRoute>} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
