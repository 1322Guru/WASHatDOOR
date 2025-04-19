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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AuthContext } from '../../context/auth/authContext';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneIcon from '@mui/icons-material/Phone';

const SignIn = () => {
  const authContext = useContext(AuthContext);
  const { login, error, clearErrors, isAuthenticated, loading, socialLogin, sendVerificationCode, verifyPhone } = authContext || {};
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
    email: '',
    password: '',
  });

  const [phoneVerificationOpen, setPhoneVerificationOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    // Use the login function from AuthContext
    if (login) {
      login({
        email,
        password,
      });
    } else {
      console.error('AuthContext not properly initialized');
    }
  };

  const handleGoogleLogin = async () => {
    if (socialLogin) {
      try {
        // In a real app, you would use the Google Sign-In API
        // For this example, we'll simulate a successful login
        const mockGoogleToken = 'mock-google-token';
        await socialLogin('google', mockGoogleToken, 'user');
      } catch (err) {
        console.error('Google login error:', err);
      }
    }
  };

  const handleFacebookLogin = async () => {
    if (socialLogin) {
      try {
        // In a real app, you would use the Facebook Login API
        // For this example, we'll simulate a successful login
        const mockFacebookToken = 'mock-facebook-token';
        await socialLogin('facebook', mockFacebookToken, 'user');
      } catch (err) {
        console.error('Facebook login error:', err);
      }
    }
  };

  const handleAppleLogin = async () => {
    if (socialLogin) {
      try {
        // In a real app, you would use the Apple Sign-In API
        // For this example, we'll simulate a successful login
        const mockAppleToken = 'mock-apple-token';
        await socialLogin('apple', mockAppleToken, 'user');
      } catch (err) {
        console.error('Apple login error:', err);
      }
    }
  };

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
    if (!phoneNumber) {
      setVerificationError('Please enter a phone number');
      return;
    }

    setVerificationLoading(true);
    setVerificationError('');

    try {
      if (sendVerificationCode) {
        await sendVerificationCode(phoneNumber);
        setVerificationSent(true);
        setVerificationSuccess('Verification code sent!');
      }
    } catch (err) {
      setVerificationError('Failed to send verification code. Please try again.');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setVerificationError('Please enter the verification code');
      return;
    }

    setVerificationLoading(true);
    setVerificationError('');

    try {
      if (verifyPhone) {
        const result = await verifyPhone(phoneNumber, verificationCode);
        if (result.verified) {
          setVerificationSuccess('Phone number verified successfully!');
          // Close the dialog after a short delay
          setTimeout(() => {
            handlePhoneVerificationClose();
          }, 1500);
        } else {
          setVerificationError('Invalid verification code. Please try again.');
        }
      }
    } catch (err) {
      setVerificationError('Failed to verify code. Please try again.');
    } finally {
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
        position: 'relative',
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            color: 'white',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" className="washatdoor-text" align="center" gutterBottom>
              Sign In
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={onSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={onChange}
              margin="normal"
              required
              disabled={loading}
              sx={{
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
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={onChange}
              margin="normal"
              required
              disabled={loading}
              sx={{
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="washatdoor-text"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2,
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Link 
                component={RouterLink} 
                to="/signup" 
                variant="body2"
                className="washatdoor-text"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </form>

          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.3)' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              OR
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Continue with Google
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={handleFacebookLogin}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Continue with Facebook
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AppleIcon />}
              onClick={handleAppleLogin}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Continue with Apple
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PhoneIcon />}
              onClick={handlePhoneVerificationOpen}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Verify Phone Number
            </Button>
          </Box>
        </Paper>
      </Container>
      
      {/* Service Provider Login link at the bottom of the screen */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 20, 
          left: 0, 
          right: 0, 
          textAlign: 'center' 
        }}
      >
        <Link 
          component={RouterLink} 
          to="/provider-login" 
          variant="body1"
          className="washatdoor-text"
          sx={{ 
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '8px 16px',
            borderRadius: '4px',
          }}
        >
          Are you a service provider? Sign In
        </Link>
      </Box>

      {/* Phone Verification Dialog */}
      <Dialog 
        open={phoneVerificationOpen} 
        onClose={handlePhoneVerificationClose}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'white',
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" className="washatdoor-text">
            Phone Verification
          </Typography>
        </DialogTitle>
        <DialogContent>
          {verificationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {verificationError}
            </Alert>
          )}
          
          {verificationSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {verificationSuccess}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            margin="normal"
            disabled={verificationSent}
            sx={{
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
          />
          
          {verificationSent && (
            <TextField
              fullWidth
              label="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              margin="normal"
              sx={{
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
            />
          )}
        </DialogContent>
        <DialogActions>
          {!verificationSent ? (
            <Button 
              onClick={handleSendVerificationCode} 
              variant="contained"
              disabled={verificationLoading}
              sx={{ 
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20',
                },
              }}
            >
              {verificationLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Code'}
            </Button>
          ) : (
            <Button 
              onClick={handleVerifyCode} 
              variant="contained"
              disabled={verificationLoading}
              sx={{ 
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20',
                },
              }}
            >
              {verificationLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify Code'}
            </Button>
          )}
          <Button onClick={handlePhoneVerificationClose} sx={{ color: 'white' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignIn; 