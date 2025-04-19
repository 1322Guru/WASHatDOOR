import React, { useState, useContext, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
} from '@mui/material';
import UserMenu from '../common/UserMenu';
import { AuthContext } from '../../context/auth/authContext';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneIcon from '@mui/icons-material/Phone';
import CloseIcon from '@mui/icons-material/Close';

const SignUp = () => {
  const authContext = useContext(AuthContext);
  const { register, error, clearErrors, isAuthenticated, loading } = authContext || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/booking');
    }
    return () => {
      clearErrors && clearErrors();
    };
    // eslint-disable-next-line
  }, [error, isAuthenticated]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [formErrors, setFormErrors] = useState({});
  
  // Phone verification states
  const [phoneVerificationOpen, setPhoneVerificationOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const { name, email, password, confirmPassword, phone } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Use the register function from AuthContext
    if (register) {
      register({
        name,
        email,
        password,
        phone,
      });
    } else {
      console.error('AuthContext not properly initialized');
    }
  };

  // Social login handlers
  const handleGoogleLogin = async () => {
    try {
      // In a real implementation, this would redirect to Google OAuth
      // For now, we'll simulate a successful login
      console.log('Google login clicked');
      // Mock successful login
      // In a real implementation, you would use Google OAuth API
      alert('Google login functionality will be implemented with OAuth');
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      // In a real implementation, this would redirect to Facebook OAuth
      console.log('Facebook login clicked');
      // Mock successful login
      // In a real implementation, you would use Facebook OAuth API
      alert('Facebook login functionality will be implemented with OAuth');
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  };

  const handleAppleLogin = async () => {
    try {
      // In a real implementation, this would redirect to Apple OAuth
      console.log('Apple login clicked');
      // Mock successful login
      // In a real implementation, you would use Apple OAuth API
      alert('Apple login functionality will be implemented with OAuth');
    } catch (error) {
      console.error('Apple login error:', error);
    }
  };

  // Phone verification handlers
  const handlePhoneVerificationOpen = () => {
    setPhoneVerificationOpen(true);
  };

  const handlePhoneVerificationClose = () => {
    setPhoneVerificationOpen(false);
    setPhoneNumber('');
    setVerificationCode('');
    setVerificationSent(false);
    setVerificationError('');
    setVerificationSuccess(false);
  };

  const handleSendVerificationCode = async () => {
    if (!phoneNumber.trim()) {
      setVerificationError('Please enter a phone number');
      return;
    }

    setVerificationLoading(true);
    setVerificationError('');

    try {
      // In a real implementation, this would call your backend API to send an SMS
      // For now, we'll simulate a successful code sending
      setTimeout(() => {
        setVerificationSent(true);
        setVerificationLoading(false);
        // In a real implementation, you would not show the code to the user
        alert(`Verification code sent! (Demo code: 123456)`);
      }, 1500);
    } catch (error) {
      setVerificationError('Failed to send verification code. Please try again.');
      setVerificationLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationError('Please enter the verification code');
      return;
    }

    setVerificationLoading(true);
    setVerificationError('');

    try {
      // In a real implementation, this would call your backend API to verify the code
      // For now, we'll simulate a successful verification
      setTimeout(() => {
        if (verificationCode === '123456') {
          setVerificationSuccess(true);
          // Update the phone number in the form
          setFormData({ ...formData, phone: phoneNumber });
          // Close the dialog after a short delay
          setTimeout(() => {
            handlePhoneVerificationClose();
          }, 1500);
        } else {
          setVerificationError('Invalid verification code. Please try again.');
        }
        setVerificationLoading(false);
      }, 1000);
    } catch (error) {
      setVerificationError('Failed to verify code. Please try again.');
      setVerificationLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/Background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <UserMenu userType="customer" />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography 
            variant="h4" 
            className="washatdoor-text"
            sx={{ 
              mb: 4,
              textAlign: 'center',
              fontFamily: 'ff-nexus-serif, serif',
              fontStyle: 'normal',
              fontWeight: 400,
            }}
          >
            WASHatDOOR
          </Typography>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              '& .MuiTypography-root': {
                color: 'white',
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" className="washatdoor-text" align="center" gutterBottom>
                Sign Up
              </Typography>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <form onSubmit={onSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={onChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={onChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                autoComplete="tel"
                value={phone}
                onChange={onChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <IconButton 
                      color="primary" 
                      onClick={handlePhoneVerificationOpen}
                      sx={{ color: 'white' }}
                    >
                      <PhoneIcon />
                    </IconButton>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={onChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={onChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  backgroundColor: '#2e7d32',
                  '&:hover': {
                    backgroundColor: '#1b5e20',
                  },
                }}
                className="washatdoor-text"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </Button>
              
              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  OR
                </Typography>
              </Divider>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                <IconButton 
                  onClick={handleGoogleLogin}
                  sx={{ 
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' }
                  }}
                >
                  <GoogleIcon sx={{ color: '#DB4437' }} />
                </IconButton>
                <IconButton 
                  onClick={handleAppleLogin}
                  sx={{ 
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' }
                  }}
                >
                  <AppleIcon sx={{ color: 'black' }} />
                </IconButton>
                <IconButton 
                  onClick={handleFacebookLogin}
                  sx={{ 
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' }
                  }}
                >
                  <FacebookIcon sx={{ color: '#4267B2' }} />
                </IconButton>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Link component={RouterLink} to="/signin" variant="body2" className="washatdoor-text">
                  Already have an account? Sign In
                </Link>
                <Link component={RouterLink} to="/provider-signup" variant="body2" className="washatdoor-text">
                  Sign up as Service Provider
                </Link>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
      
      {/* Phone Verification Dialog */}
      <Dialog 
        open={phoneVerificationOpen} 
        onClose={handlePhoneVerificationClose}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            '& .MuiTypography-root': {
              color: 'white',
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Phone Verification</Typography>
            <IconButton 
              edge="end" 
              color="inherit" 
              onClick={handlePhoneVerificationClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {verificationSuccess ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Phone number verified successfully!
            </Alert>
          ) : (
            <>
              {verificationError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {verificationError}
                </Alert>
              )}
              
              {!verificationSent ? (
                <TextField
                  autoFocus
                  margin="dense"
                  label="Phone Number"
                  type="tel"
                  fullWidth
                  variant="outlined"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={verificationLoading}
                  sx={{ mt: 2 }}
                />
              ) : (
                <TextField
                  autoFocus
                  margin="dense"
                  label="Verification Code"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={verificationLoading}
                  sx={{ mt: 2 }}
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {!verificationSuccess && (
            <>
              {!verificationSent ? (
                <Button 
                  onClick={handleSendVerificationCode} 
                  color="primary"
                  disabled={verificationLoading}
                >
                  {verificationLoading ? <CircularProgress size={24} /> : 'Send Code'}
                </Button>
              ) : (
                <Button 
                  onClick={handleVerifyCode} 
                  color="primary"
                  disabled={verificationLoading}
                >
                  {verificationLoading ? <CircularProgress size={24} /> : 'Verify'}
                </Button>
              )}
            </>
          )}
          <Button onClick={handlePhoneVerificationClose} color="primary">
            {verificationSuccess ? 'Close' : 'Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignUp; 