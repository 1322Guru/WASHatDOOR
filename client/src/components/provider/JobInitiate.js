import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Divider,
  Alert,
  Fab,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WarningIcon from '@mui/icons-material/Warning';
import UserMenu from '../common/UserMenu';

const Input = styled('input')({
  display: 'none',
});

const JobInitiate = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState({
    beforePhotos: [],
    afterPhotos: [],
    notes: '',
    timeSpent: '',
    jobReview: '',
    hasIssues: false,
  });
  const [emergencyAlert, setEmergencyAlert] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState('');

  const steps = ['Job Review', 'Before Photos', 'Job Details', 'After Photos', 'Review'];

  const handlePhotoUpload = (type, event) => {
    const files = Array.from(event.target.files);
    setJobData(prev => ({
      ...prev,
      [type]: [...prev[type], ...files],
    }));
  };

  const handleRemovePhoto = (type, index) => {
    setJobData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    setJobData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleIssueToggle = () => {
    setJobData(prev => ({
      ...prev,
      hasIssues: !prev.hasIssues,
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to submit job data
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API call
      navigate('/provider/appointments');
    } catch (error) {
      console.error('Error submitting job:', error);
    } finally {
      setLoading(false);
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
      
      // In a real app, this would send the location to the admin
      console.log(`Emergency alert: Provider location is ${location}`);
      
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ py: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Initial Job Review
            </Typography>
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3, 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '& .MuiAlert-icon': {
                  color: 'white',
                },
              }}
            >
              Please inspect the vehicle and report any existing damages or issues before starting the job.
            </Alert>
            
            <Box sx={{ mb: 3 }}>
              <Button
                variant={jobData.hasIssues ? "contained" : "outlined"}
                color={jobData.hasIssues ? "error" : "primary"}
                startIcon={<WarningIcon />}
                onClick={handleIssueToggle}
                sx={{ 
                  mb: 2,
                  borderColor: 'white',
                  color: jobData.hasIssues ? 'white' : 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: jobData.hasIssues ? 'rgba(211, 47, 47, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {jobData.hasIssues ? "Issues Found" : "No Issues Found"}
              </Button>
            </Box>
            
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Job Review"
              name="jobReview"
              value={jobData.jobReview}
              onChange={handleChange}
              placeholder={jobData.hasIssues 
                ? "Describe any damages, scratches, dents, or other issues found on the vehicle..." 
                : "Describe the vehicle's condition and any special instructions for the job..."}
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
          </Box>
        );

      case 1:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Upload Before Photos
            </Typography>
            <label htmlFor="before-photos">
              <Input
                accept="image/*"
                id="before-photos"
                multiple
                type="file"
                onChange={(e) => handlePhotoUpload('beforePhotos', e)}
              />
              <Button
                variant="contained"
                component="span"
                startIcon={<AddPhotoAlternateIcon />}
                sx={{
                  backgroundColor: '#2e7d32',
                  '&:hover': {
                    backgroundColor: '#1b5e20',
                  },
                }}
              >
                Add Photos
              </Button>
            </label>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {jobData.beforePhotos.map((photo, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={URL.createObjectURL(photo)}
                      alt={`Before ${index + 1}`}
                    />
                    <CardActions>
                      <IconButton
                        color="error"
                        onClick={() => handleRemovePhoto('beforePhotos', index)}
                        sx={{ color: 'white' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ py: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Job Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Notes"
                  name="notes"
                  value={jobData.notes}
                  onChange={handleChange}
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Time Spent (hours)"
                  name="timeSpent"
                  type="number"
                  value={jobData.timeSpent}
                  onChange={handleChange}
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
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Upload After Photos
            </Typography>
            <label htmlFor="after-photos">
              <Input
                accept="image/*"
                id="after-photos"
                multiple
                type="file"
                onChange={(e) => handlePhotoUpload('afterPhotos', e)}
              />
              <Button
                variant="contained"
                component="span"
                startIcon={<AddPhotoAlternateIcon />}
                sx={{
                  backgroundColor: '#2e7d32',
                  '&:hover': {
                    backgroundColor: '#1b5e20',
                  },
                }}
              >
                Add Photos
              </Button>
            </label>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {jobData.afterPhotos.map((photo, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={URL.createObjectURL(photo)}
                      alt={`After ${index + 1}`}
                    />
                    <CardActions>
                      <IconButton
                        color="error"
                        onClick={() => handleRemovePhoto('afterPhotos', index)}
                        sx={{ color: 'white' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ py: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Review Job Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'white' }}>
                  Initial Job Review:
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {jobData.jobReview || 'No review provided'}
                </Typography>
                {jobData.hasIssues && (
                  <Alert 
                    severity="warning" 
                    sx={{ 
                      mt: 1, 
                      backgroundColor: 'rgba(255, 152, 0, 0.2)',
                      color: 'white',
                      '& .MuiAlert-icon': {
                        color: 'white',
                      },
                    }}
                  >
                    Issues were reported with this vehicle
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'white' }}>
                  Notes:
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{jobData.notes}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'white' }}>
                  Time Spent:
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{jobData.timeSpent} hours</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'white' }}>
                  Before Photos: {jobData.beforePhotos.length}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'white' }}>
                  After Photos: {jobData.afterPhotos.length}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
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
      
      {/* Emergency Button */}
      <Fab
        color="error"
        aria-label="emergency"
        onClick={handleEmergency}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        }}
      >
        <WarningIcon />
      </Fab>
      
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton
              onClick={() => navigate('/provider/appointments')}
              sx={{ color: 'white', mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" className="washatdoor-text">
              Job Initiation
            </Typography>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 3 }} />

          <Typography variant="subtitle1" gutterBottom align="center" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Appointment ID: {appointmentId}
          </Typography>

          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              my: 4,
              '& .MuiStepLabel-root .Mui-active': {
                color: '#2e7d32',
              },
              '& .MuiStepLabel-root .Mui-completed': {
                color: '#2e7d32',
              },
              '& .MuiStepLabel-root .MuiStepIcon-root': {
                color: 'rgba(255, 255, 255, 0.3)',
              },
              '& .MuiStepLabel-root .Mui-active .MuiStepIcon-root': {
                color: '#2e7d32',
              },
              '& .MuiStepLabel-root .Mui-completed .MuiStepIcon-root': {
                color: '#2e7d32',
              },
              '& .MuiStepLabel-label': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiStepLabel-label.Mui-active': {
                color: 'white',
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ color: 'white' }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={loading}
              sx={{
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : activeStep === steps.length - 1 ? (
                'Submit'
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default JobInitiate; 