import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import { AuthContext } from '../../context/auth/authContext';
import UserMenu from '../common/UserMenu';

const UpdateAddress = () => {
  const authContext = useContext(AuthContext);
  const { user, loadUser } = authContext || {};
  
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (user && user.address) {
      setAddress(user.address);
    } else if (loadUser) {
      loadUser();
    }
  }, [user, loadUser]);

  const handleChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would make an API call to update the user's address
    console.log('Updating address to:', address);
    
    // Simulate successful update
    setSnackbar({
      open: true,
      message: 'Address updated successfully!',
      severity: 'success',
    });
    
    setIsEditing(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/Background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <UserMenu userType="customer" />
      <Container maxWidth="md" sx={{ pt: 10, pb: 5 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            color: 'white',
          }}
        >
          <Typography variant="h4" gutterBottom className="washatdoor-text" align="center">
            Update Address
          </Typography>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 3 }} />
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  Your current address:
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                  {address || 'No address provided'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Address"
                  multiline
                  rows={4}
                  value={address}
                  onChange={handleChange}
                  disabled={!isEditing}
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
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                  {isEditing ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        className="washatdoor-text"
                        sx={{ 
                          backgroundColor: '#2e7d32',
                          '&:hover': {
                            backgroundColor: '#1b5e20',
                          },
                        }}
                      >
                        Save Address
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setIsEditing(false)}
                        sx={{ 
                          color: 'white',
                          borderColor: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setIsEditing(true)}
                      className="washatdoor-text"
                      sx={{ 
                        backgroundColor: '#2e7d32',
                        '&:hover': {
                          backgroundColor: '#1b5e20',
                        },
                      }}
                    >
                      Edit Address
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateAddress; 