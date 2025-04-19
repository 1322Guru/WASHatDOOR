import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Rating,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import UserMenu from '../common/UserMenu';

const ServiceHistory = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for service history
  const [services] = useState([
    {
      id: 1,
      date: '2024-03-15',
      time: '10:00 AM',
      service: 'Gold Wash',
      vehicleType: 'SUV',
      status: 'completed',
      price: 75,
      provider: 'John\'s Car Care',
      location: '123 Main St, City, State',
      rating: 4,
      feedback: 'Great service! Very thorough cleaning.',
    },
    {
      id: 2,
      date: '2024-02-28',
      time: '2:30 PM',
      service: 'Quick Wash + Vacuum',
      vehicleType: 'Sedan',
      status: 'completed',
      price: 45,
      provider: 'Elite Auto Spa',
      location: '456 Oak Ave, City, State',
      rating: 5,
      feedback: 'Excellent service and very professional staff.',
    },
    {
      id: 3,
      date: '2024-02-15',
      time: '11:00 AM',
      service: 'Detailing',
      vehicleType: 'Truck',
      status: 'completed',
      price: 120,
      provider: 'Premium Car Care',
      location: '789 Pine St, City, State',
      rating: null,
      feedback: null,
    },
  ]);

  const handleOpenDialog = (service) => {
    setSelectedService(service);
    setRating(service.rating || 0);
    setFeedback(service.feedback || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedService(null);
    setRating(0);
    setFeedback('');
  };

  const handleSubmitFeedback = () => {
    // In a real app, this would make an API call to update the rating and feedback
    const updatedServices = services.map(service => {
      if (service.id === selectedService.id) {
        return {
          ...service,
          rating,
          feedback,
        };
      }
      return service;
    });

    // Update the services state (in a real app, this would be handled by the backend)
    // setServices(updatedServices);

    setSnackbar({
      open: true,
      message: 'Thank you for your feedback!',
      severity: 'success',
    });
    handleCloseDialog();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'scheduled':
        return 'info';
      default:
        return 'default';
    }
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
      <Container maxWidth="lg" sx={{ pt: 10, pb: 5 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            color: 'white',
          }}
        >
          <Typography variant="h4" className="washatdoor-text" sx={{ mb: 3 }}>
            Service History
          </Typography>
          
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} key={service.id}>
                <Card 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(5px)',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: 'white' }}>
                        {service.service}
                      </Typography>
                      <Chip 
                        label={service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        color={getStatusColor(service.status)}
                        size="small"
                      />
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccessTimeIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {formatDate(service.date)} at {service.time}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOnIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {service.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DirectionsCarIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {service.vehicleType}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                          Provider: {service.provider}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                          Price: ${service.price}
                        </Typography>
                        {service.rating && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating 
                              value={service.rating} 
                              readOnly 
                              sx={{ 
                                '& .MuiRating-iconFilled': {
                                  color: '#2e7d32',
                                },
                              }}
                            />
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                    
                    {service.feedback && (
                      <>
                        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Your feedback: {service.feedback}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                  
                  <CardActions>
                    {!service.rating ? (
                      <Button 
                        onClick={() => handleOpenDialog(service)}
                        sx={{ 
                          color: '#2e7d32',
                          '&:hover': {
                            backgroundColor: 'rgba(46, 125, 50, 0.1)',
                          },
                        }}
                      >
                        Rate & Review
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleOpenDialog(service)}
                        sx={{ 
                          color: '#2e7d32',
                          '&:hover': {
                            backgroundColor: 'rgba(46, 125, 50, 0.1)',
                          },
                        }}
                      >
                        Update Review
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'white',
          },
        }}
      >
        <DialogTitle>Rate Your Experience</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {selectedService?.service} on {selectedService && formatDate(selectedService.date)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Provider: {selectedService?.provider}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography component="legend" sx={{ mb: 1 }}>Rating</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#2e7d32',
                },
              }}
            />
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{
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
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitFeedback}
            variant="contained"
            sx={{ 
              backgroundColor: '#2e7d32',
              '&:hover': {
                backgroundColor: '#1b5e20',
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServiceHistory; 