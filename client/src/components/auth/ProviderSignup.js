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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { AuthContext } from '../../context/auth/authContext';

const SERVICE_OPTIONS = [
  'Laundry',
  'Dry Cleaning',
  'Ironing',
  'Folding',
  'Starching',
  'Express Service',
];

const ProviderSignup = () => {
  const authContext = useContext(AuthContext);
  const { registerProvider, error, clearErrors, isAuthenticated, loading } = authContext || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/provider-dashboard');
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
    serviceArea: '',
    services: [],
    description: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const { name, email, password, confirmPassword, phone, serviceArea, services, description } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const handleServiceChange = (event) => {
    setFormData({ ...formData, services: event.target.value });
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

    if (!serviceArea.trim()) {
      errors.serviceArea = 'Service area is required';
      isValid = false;
    }

    if (services.length === 0) {
      errors.services = 'At least one service must be selected';
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
    
    // Use the registerProvider function from AuthContext
    if (registerProvider) {
      registerProvider({
        name,
        email,
        password,
        phone,
        serviceArea,
        services,
        description,
      });
    } else {
      console.error('AuthContext not properly initialized');
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
                Service Provider Sign Up
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
              <TextField
                margin="normal"
                required
                fullWidth
                id="serviceArea"
                label="Service Area"
                name="serviceArea"
                value={serviceArea}
                onChange={onChange}
                error={!!formErrors.serviceArea}
                helperText={formErrors.serviceArea}
                disabled={loading}
              />
              <FormControl 
                fullWidth 
                margin="normal"
                error={!!formErrors.services}
              >
                <InputLabel id="services-label">Services Offered</InputLabel>
                <Select
                  labelId="services-label"
                  id="services"
                  multiple
                  value={services}
                  onChange={handleServiceChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  disabled={loading}
                >
                  {SERVICE_OPTIONS.map((service) => (
                    <MenuItem key={service} value={service}>
                      {service}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.services && (
                  <Typography color="error" variant="caption">
                    {formErrors.services}
                  </Typography>
                )}
              </FormControl>
              <TextField
                margin="normal"
                fullWidth
                id="description"
                label="Description (Optional)"
                name="description"
                multiline
                rows={4}
                value={description}
                onChange={onChange}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up as Provider'}
              </Button>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Link component={RouterLink} to="/signin" variant="body2" className="washatdoor-text">
                  Already have an account? Sign In
                </Link>
                <Link component={RouterLink} to="/signup" variant="body2" className="washatdoor-text">
                  Sign up as Customer
                </Link>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ProviderSignup; 