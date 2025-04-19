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
  Chip,
  Avatar,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppointmentMessaging from '../common/AppointmentMessaging';
import CustomerAIChatbot from '../common/CustomerAIChatbot';

const CustomerDashboard = () => {
  const [showMessaging, setShowMessaging] = useState(false);
  const [showAIChatbot, setShowAIChatbot] = useState(false);

  // Handle dialog close
  const handleClose = () => {
    setDetailsOpen(false);
    setShowMessaging(false);
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
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="washatdoor-text">
            Customer Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
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
            Customer Dashboard
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
                
                {appointmentsForSelectedDate.length > 0 ? (
                  <List>
                    {appointmentsForSelectedDate.map((appointment) => (
                      <React.Fragment key={appointment.id}>
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
                                  {format(appointment.serviceDate, 'h:mm a')} - {appointment.serviceProvider}
                                </Typography>
                                <Chip 
                                  label={appointment.status} 
                                  color={
                                    appointment.status === 'upcoming' 
                                      ? 'primary' 
                                      : appointment.status === 'accepted' 
                                        ? 'success' 
                                        : appointment.status === 'pending'
                                          ? 'warning'
                                          : 'default'
                                  }
                                  size="small"
                                />
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
                        Service Provider: {selectedAppointment.serviceProvider}
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
                        Date & Time: {format(selectedAppointment.serviceDate, 'MMMM d, yyyy h:mm a')}
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
                Message Service Provider
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
                Call Service Provider
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
            Message with {selectedAppointment?.serviceProvider}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <AppointmentMessaging 
            appointmentId={selectedAppointment?.id} 
            userType="customer" 
            userName="Customer" 
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
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <CustomerAIChatbot open={showAIChatbot} onClose={() => setShowAIChatbot(false)} />
      </Dialog>
    </Box>
  );
};

export default CustomerDashboard; 