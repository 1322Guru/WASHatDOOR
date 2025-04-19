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
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { format } from 'date-fns';
import UserMenu from '../common/UserMenu';
import { useNavigate } from 'react-router-dom';

const ProviderAppointments = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      customerName: 'John Doe',
      service: 'Gold Wash',
      date: '2024-03-20',
      time: '10:00 AM',
      status: 'upcoming',
      vehicleType: 'SUV',
      location: '123 Main St, City, State',
      price: 75,
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      service: 'Quick Wash',
      date: '2024-03-19',
      time: '2:30 PM',
      status: 'completed',
      vehicleType: 'Sedan',
      location: '456 Oak Ave, City, State',
      price: 45,
    },
    {
      id: 3,
      customerName: 'Bob Wilson',
      service: 'Detailing',
      date: '2024-03-18',
      time: '11:00 AM',
      status: 'cancelled',
      vehicleType: 'Truck',
      location: '789 Pine St, City, State',
      price: 120,
    },
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAppointment(null);
    setNotes('');
  };

  const handleStatusChange = (newStatus) => {
    // TODO: Implement status change logic
    console.log('Change status to:', newStatus);
    handleCloseDialog();
  };

  const handleDeliverService = (appointment) => {
    // Navigate to the JobInitiate page with the appointment ID
    navigate(`/provider/job-initiate/${appointment.id}`);
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (selectedTab === 0) return appointment.status === 'upcoming';
    if (selectedTab === 1) return appointment.status === 'completed';
    if (selectedTab === 2) return appointment.status === 'cancelled';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
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
      <UserMenu userType="provider" />
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
          <Typography variant="h4" className="washatdoor-text" sx={{ mb: 4 }}>
            Manage Appointments
          </Typography>

          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': {
                  color: 'white',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#2e7d32',
              },
            }}
          >
            <Tab label="Upcoming" />
            <Tab label="Completed" />
            <Tab label="Cancelled" />
          </Tabs>

          <Grid container spacing={3}>
            {filteredAppointments.map((appointment) => (
              <Grid item xs={12} key={appointment.id}>
                <Card 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        {appointment.customerName}
                      </Typography>
                      <Chip 
                        label={appointment.status} 
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body1" gutterBottom>
                      {appointment.service} - {appointment.vehicleType}
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                      {appointment.date} at {appointment.time}
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                      Location: {appointment.location}
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                      Price: ${appointment.price}
                    </Typography>
                    {appointment.status === 'upcoming' && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Appointment Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
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
                Appointment Details
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedAppointment.customerName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Service: {selectedAppointment.service}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Date: {selectedAppointment.date}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Time: {selectedAppointment.time}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Vehicle Type: {selectedAppointment.vehicleType}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Location: {selectedAppointment.location}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Price: ${selectedAppointment.price}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{
                    mt: 2,
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
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              {selectedAppointment.status === 'upcoming' && (
                <>
                  <Button
                    onClick={() => handleStatusChange('completed')}
                    variant="contained"
                    sx={{
                      backgroundColor: '#2e7d32',
                      '&:hover': {
                        backgroundColor: '#1b5e20',
                      },
                    }}
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    onClick={() => handleStatusChange('cancelled')}
                    variant="contained"
                    sx={{
                      backgroundColor: '#d32f2f',
                      '&:hover': {
                        backgroundColor: '#b71c1c',
                      },
                    }}
                  >
                    Cancel Appointment
                  </Button>
                </>
              )}
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ProviderAppointments; 