import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import PaymentPage from './pages/PaymentPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import BookingManager from './components/BookingManager';
import BookingCalendar from './components/BookingCalendar';
import AdminDashboard from './components/admin/AdminDashboard';
import { NotificationProvider } from './contexts/NotificationContext';
const adminRoutes = require('./routes/admin');
const { initializeReminders } = require('./utils/schedulerService');
const paymentRoutes = require('./routes/payments');
import './App.css';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import AccessibilityMenu from './components/common/AccessibilityMenu';
import CoachesList from './components/coach/CoachesList';
import CoachProfileForm from './components/coach/CoachProfileForm';
import PrivateRoute from './components/common/PrivateRoute';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import CookiePolicy from './pages/CookiePolicy';
import CoachAgreement from './pages/CoachAgreement';

function App() {
  return (
    <AccessibilityProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/bookings" element={<BookingManager />} />
            <Route path="/calendar" element={<BookingCalendar />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/coaches" element={<CoachesList />} />
            <Route path="/coach/profile" element={
                <PrivateRoute>
                    <CoachProfileForm />
                </PrivateRoute>
            } />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/coach-agreement" element={<CoachAgreement />} />
          </Routes>
        </Router>
      </NotificationProvider>
      <AccessibilityMenu />
    </AccessibilityProvider>
  );
}

// Initialize reminders for existing bookings
initializeReminders().catch(console.error);

export default App;
