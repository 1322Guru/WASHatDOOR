import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { format, isSameDay } from 'date-fns';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppointmentMessaging from '../common/AppointmentMessaging';
import ProviderAIChatbot from '../common/ProviderAIChatbot';
import UserMenu from '../common/UserMenu';

const ServiceProviderDashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showAIChatbot, setShowAIChatbot] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointments when component mounts or date changes
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        // Format date as YYYY-MM-DD for the API
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const response = await axios.get(`/api/provider/appointments/${formattedDate}`, config);
        setAppointments(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate]);

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle appointment selection
  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailsOpen(true);
  };

  // Handle dialog close
  const handleClose = () => {
    setDetailsOpen(false);
    setShowMessaging(false);
  };

  // Handle navigation to service location
  const handleNavigate = () => {
    if (selectedAppointment) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAppointment.serviceLocation)}`, '_blank');
    }
  };

  // Handle phone call
  const handleCall = () => {
    if (selectedAppointment) {
      window.open(`tel:${selectedAppointment.customerPhone}`, '_blank');
    }
  };

  // Handle service delivery
  const handleDeliverService = async (appointment) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      await axios.post(`/api/provider/appointments/${appointment._id}/deliver`, {}, config);
      
      // Update the appointment in the local state
      const updatedAppointments = appointments.map(app => 
        app._id === appointment._id 
          ? { ...app, status: 'in-progress', startTime: new Date() } 
          : app
      );
      setAppointments(updatedAppointments);
      
      // Navigate to the job initiation page
      navigate(`/provider/job-initiate/${appointment._id}`);
    } catch (err) {
      console.error('Error starting service delivery:', err);
      setError('Failed to start service delivery. Please try again.');
    }
  };

  // Handle emergency button click
  const handleEmergency = async () => {
    try {
      // Get current location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      const location = `${latitude},${longitude}`;
      
      // Send emergency alert to the server
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      await axios.post('/api/provider/emergency', { location }, config);
      
      // Show success message
      setEmergencyMessage('Emergency services have been notified with your location');
      setEmergencyAlert(true);
      
      // Place 911 call
      window.open('tel:911', '_blank');
      
    } catch (error) {
      console.error('Error getting location:', error);
      setEmergencyMessage('Could not get your location. Please call 911 manually.');
      setEmergencyAlert(true);
    }
  };

  // Handle closing the emergency alert
  const handleCloseEmergencyAlert = () => {
    setEmergencyAlert(false);
  };

  // Filter appointments for the selected date
  const appointmentsForSelectedDate = appointments.filter(appointment => 
    isSameDay(new Date(appointment.serviceDate), selectedDate)
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/Background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* AppBar with UserMenu */}
      <AppBar position="fixed" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="washatdoor-text">
            Service Provider Dashboard
          </Typography>
          <UserMenu userType="provider" onAIChatbotClick={() => setShowAIChatbot(true)} />
        </Toolbar>
      </AppBar>
      
      {/* Emergency Alert Snackbar */}
      <Snackbar
        open={emergencyAlert}
        autoHideDuration={6000}
        onClose={handleCloseEmergencyAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseEmergencyAlert} severity="error" sx={{ width: '100%' }}>
          {emergencyMessage}
        </Alert>
      </Snackbar>
      
      {/* Error Alert */}
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
      
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
          <Typography variant="h4" className="washatdoor-text" align="center" gutterBottom>
            Service Provider Dashboard
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {/* Calendar Section */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  height: '100%',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Calendar
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    sx={{
                      color: 'white',
                      '& .MuiPickersDay-root': {
                        color: 'white',
                      },
                      '& .MuiPickersDay-root.Mui-selected': {
                        backgroundColor: '#2e7d32',
                        '&:hover': {
                          backgroundColor: '#1b5e20',
                        },
                      },
                      '& .MuiPickersDay-today': {
                        borderColor: '#2e7d32',
                      },
                    }}
                  />
                </LocalizationProvider>
              </Paper>
            </Grid>
            
            {/* Appointments Section */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  height: '100%',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Appointments for {format(selectedDate, 'MMMM d, yyyy')}
                </Typography>
                
                {loading ? (
                  <Typography variant="body1" align="center" sx={{ mt: 4 }}>
                    Loading appointments...
                  </Typography>
                ) : appointmentsForSelectedDate.length > 0 ? (
                  <List>
                    {appointmentsForSelectedDate.map((appointment) => (
                      <React.Fragment key={appointment._id}>
                        <ListItem 
                          button 
                          onClick={() => handleAppointmentClick(appointment)}
                          sx={{ 
                            borderRadius: 1,
                            mb: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle1">
                                  {format(new Date(appointment.serviceDate), 'h:mm a')} - {appointment.customer.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {(appointment.status === 'upcoming' || appointment.status === 'pending') && (
                                    <Button
                                      variant="contained"
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeliverService(appointment);
                                      }}
                                      sx={{
                                        backgroundColor: '#2e7d32',
                                        '&:hover': {
                                          backgroundColor: '#1b5e20',
                                        },
                                      }}
                                    >
                                      Deliver Service
                                    </Button>
                                  )}
                                  <Chip 
                                    label={appointment.status} 
                                    color={
                                      appointment.status === 'upcoming' 
                                        ? 'primary' 
                                        : appointment.status === 'accepted' 
                                          ? 'success' 
                                          : appointment.status === 'pending'
                                            ? 'warning'
                                            : appointment.status === 'in-progress'
                                              ? 'info'
                                              : 'default'
                                    }
                                    size="small"
                                  />
                                </Box>
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                                {appointment.package} (Service) - {appointment.vehicleType}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" align="center" sx={{ mt: 4 }}>
                    No appointments scheduled for this date.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      
      {/* Service Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'white',
          }
        }}
      >
        {selectedAppointment && (
          <>
            <DialogTitle>
              <Typography variant="h5" className="washatdoor-text">
                Service Details
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        Customer: {selectedAppointment.customer.name}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocalOfferIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        Service Type: {selectedAppointment.package}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">
                        Vehicle Type: {selectedAppointment.vehicleType}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOnIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        Location: {selectedAppointment.serviceLocation}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">
                        Date & Time: {format(new Date(selectedAppointment.serviceDate), 'MMMM d, yyyy h:mm a')}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  {selectedAppointment.price && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1">
                          Price: ${selectedAppointment.price.toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {selectedAppointment.duration && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1">
                          Duration: {selectedAppointment.duration} minutes
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {selectedAppointment.notes && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ mr: 1 }}>
                          Notes:
                        </Typography>
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {selectedAppointment.notes}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button 
                onClick={() => setShowMessaging(true)} 
                variant="contained" 
                sx={{ 
                  backgroundColor: '#2e7d32',
                  '&:hover': {
                    backgroundColor: '#1b5e20',
                  },
                }}
              >
                Message Customer
              </Button>
              <Button 
                onClick={handleNavigate} 
                variant="contained" 
                startIcon={<LocationOnIcon />}
                sx={{ 
                  backgroundColor: '#2e7d32',
                  '&:hover': {
                    backgroundColor: '#1b5e20',
                  },
                }}
              >
                Navigate
              </Button>
              <Button 
                onClick={handleCall} 
                variant="contained" 
                startIcon={<PhoneIcon />}
                sx={{ 
                  backgroundColor: '#2e7d32',
                  '&:hover': {
                    backgroundColor: '#1b5e20',
                  },
                }}
              >
                Call Customer
              </Button>
              <Button onClick={handleClose} variant="outlined" sx={{ color: 'white', borderColor: 'white' }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Messaging Dialog */}
      <Dialog
        open={showMessaging}
        onClose={() => setShowMessaging(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'white',
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" className="washatdoor-text">
            Message with {selectedAppointment?.customer?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <AppointmentMessaging 
            appointmentId={selectedAppointment?._id} 
            userType="provider" 
            userName="Service Provider" 
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowMessaging(false)} 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* AI Chatbot Dialog */}
      <Dialog
        open={showAIChatbot}
        onClose={() => setShowAIChatbot(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'white',
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" className="washatdoor-text">
            AI Assistant
          </Typography>
        </DialogTitle>
        <DialogContent>
          <ProviderAIChatbot 
            open={showAIChatbot} 
            onClose={() => setShowAIChatbot(false)} 
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowAIChatbot(false)} 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Emergency Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={handleEmergency}
          sx={{
            borderRadius: '50px',
            px: 3,
            py: 1,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          EMERGENCY
        </Button>
      </Box>
    </Box>
  );
};

export default ServiceProviderDashboard; 