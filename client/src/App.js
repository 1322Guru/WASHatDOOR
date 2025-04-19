import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, Box, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import AuthState from './context/auth/authContext';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ProviderLogin from './components/auth/ProviderLogin';
import ProviderSignup from './components/auth/ProviderSignup';
import BookingPage from './components/booking/BookingPage';
import PaymentPage from './components/payment/PaymentPage';
import Dashboard from './components/dashboard/Dashboard';
import ServiceProviderDashboard from './components/provider/ServiceProviderDashboard';
import ManageProfile from './components/customer/ManageProfile';
import UpdateAddress from './components/customer/UpdateAddress';
import PaymentMethods from './components/customer/PaymentMethods';
import HelpCenter from './components/customer/HelpCenter';
import ServiceHistory from './components/customer/ServiceHistory';
import TestRoute from './components/customer/TestRoute';
// Import provider components
import ProviderProfile from './components/provider/ProviderProfile';
import ProviderRatings from './components/provider/ProviderRatings';
import ProviderAppointments from './components/provider/ProviderAppointments';
import ProviderDocuments from './components/provider/ProviderDocuments';
import ProviderEditProfile from './components/provider/ProviderEditProfile';
import ProviderReviews from './components/provider/ProviderReviews';
import JobInitiate from './components/provider/JobInitiate';
import UserMenu from './components/common/UserMenu';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/" />;
};

// ProviderRoute component to protect provider routes
const ProviderRoute = ({ children }) => {
  const providerToken = localStorage.getItem('providerToken');
  return providerToken ? children : <Navigate to="/provider-login" />;
};

// Header component with conditional UserMenu
const Header = () => {
  const location = useLocation();
  const [userType, setUserType] = useState('customer');
  
  useEffect(() => {
    // Determine user type based on the current route
    if (location.pathname.includes('/provider')) {
      setUserType('provider');
    } else {
      setUserType('customer');
    }
  }, [location]);

  // Don't show menu on auth pages
  const isAuthPage = ['/', '/signup', '/provider-login', '/provider-signup'].includes(location.pathname);
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.8), rgba(46, 125, 50, 0.8))',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box sx={{ width: 48 }} /> {/* Spacer for balance */}
      
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          '& img': {
            height: '40px',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }
        }}
      >
        <img src="/text.png" alt="WASHatDOOR" />
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', width: 48 }}>
        {!isAuthPage && <UserMenu userType={userType} />}
      </Box>
    </Box>
  );
};

function App() {
  return (
    <AuthState>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh',
          }}>
            <Header />
            <Box sx={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/provider-login" element={<ProviderLogin />} />
                <Route path="/provider-signup" element={<ProviderSignup />} />
                <Route path="/test" element={<TestRoute />} />
                
                {/* Protected Routes */}
                <Route
                  path="/booking"
                  element={
                    <PrivateRoute>
                      <BookingPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/payment"
                  element={
                    <PrivateRoute>
                      <PaymentPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/provider-dashboard"
                  element={
                    <ProviderRoute>
                      <ServiceProviderDashboard />
                    </ProviderRoute>
                  }
                />
                <Route
                  path="/customer/profile"
                  element={
                    <PrivateRoute>
                      <ManageProfile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/customer/address"
                  element={
                    <PrivateRoute>
                      <UpdateAddress />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/customer/payment-methods"
                  element={
                    <PrivateRoute>
                      <PaymentMethods />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/customer/help"
                  element={
                    <PrivateRoute>
                      <HelpCenter />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/customer/history"
                  element={
                    <PrivateRoute>
                      <ServiceHistory />
                    </PrivateRoute>
                  }
                />
                
                {/* Provider routes */}
                <Route path="/provider/profile" element={<ProviderProfile />} />
                <Route path="/provider/ratings" element={<ProviderRatings />} />
                <Route path="/provider/appointments" element={<ProviderAppointments />} />
                <Route path="/provider/documents" element={<ProviderDocuments />} />
                <Route path="/provider/edit-profile" element={<ProviderEditProfile />} />
                <Route path="/provider/reviews" element={<ProviderReviews />} />
                <Route path="/provider/job-initiate/:appointmentId" element={<JobInitiate />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </AuthState>
  );
}

export default App;
