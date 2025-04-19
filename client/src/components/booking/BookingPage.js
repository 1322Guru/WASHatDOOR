import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  TextField,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { format, isBefore, startOfDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('AM');
  const [vehicleType, setVehicleType] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');

  // Generate time slots from 6 AM to 11 PM with 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    const startTime = new Date();
    startTime.setHours(6, 0, 0);
    const endTime = new Date();
    endTime.setHours(23, 0, 0);

    while (startTime <= endTime) {
      slots.push(format(startTime, 'hh:mm a'));
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Package prices
  const packagePrices = {
    sedan: {
      'Quick Wash': 50,
      'Quick Wash + Vacuum': 80,
      'Gold Wash': 120,
      'Detailing': 180,
    },
  };

  // Calculate final price based on vehicle type
  const calculatePrice = (basePrice) => {
    if (vehicleType === 'SUV') {
      return basePrice * 1.2; // 20% increase for SUV
    } else if (vehicleType === 'Truck') {
      return basePrice * 1.35; // 35% increase for Truck
    }
    return basePrice;
  };

  // Get today's date at the start of the day
  const today = startOfDay(new Date());

  const handlePayment = () => {
    // In a real application, this would redirect to a secure payment gateway
    // For now, we'll just navigate to a payment page
    navigate('/payment', {
      state: {
        bookingDetails: {
          date: format(selectedDate, 'MMMM dd, yyyy'),
          time: selectedTime,
          vehicleType,
          package: selectedPackage,
          total: selectedPackage ? calculatePrice(packagePrices.sedan[selectedPackage]) : 0
        }
      }
    });
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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
            position: 'relative',
          }}
        >
          {/* Remove UserMenu component */}
        </Box>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
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
            '& .MuiRadio-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-checked': {
                color: 'white',
              },
            },
            '& .MuiFormControlLabel-label': {
              color: 'white',
            },
            '& .MuiSelect-icon': {
              color: 'white',
            },
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" className="washatdoor-text" align="center" gutterBottom>
              Book Your Appointment
            </Typography>
          </Box>

          {/* Calendar */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom className="washatdoor-text">
              Select Date
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(5px)',
                  borderRadius: 2,
                  maxWidth: '320px',
                  width: '100%',
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    minDate={today}
                    sx={{
                      width: '100%',
                      '& .MuiPickersCalendarHeader-root': {
                        padding: '8px 0',
                        '& .MuiPickersCalendarHeader-labelContainer': {
                          margin: '0 auto',
                          '& .MuiTypography-root': {
                            color: 'white',
                          },
                        },
                        '& .MuiPickersArrowSwitcher-root': {
                          '& .MuiIconButton-root:first-of-type': {
                            display: 'none',
                          },
                          '& .MuiIconButton-root:last-of-type': {
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                          },
                        },
                      },
                      '& .MuiPickersDay-root': {
                        margin: '2px',
                        width: '36px',
                        height: '36px',
                      },
                      '& .MuiPickersDay-root.Mui-disabled': {
                        color: 'rgba(255, 0, 0, 0.7)',
                        backgroundColor: 'transparent',
                      },
                      '& .MuiPickersDay-root:not(.Mui-disabled)': {
                        color: '#2e7d32',
                        '&:hover': {
                          backgroundColor: 'rgba(46, 125, 50, 0.1)',
                        },
                      },
                      '& .MuiPickersDay-root.Mui-selected': {
                        backgroundColor: '#2e7d32',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#1b5e20',
                        },
                      },
                      '& .MuiPickersDay-dayLabel': {
                        color: 'white',
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          '& .MuiInputBase-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Paper>
            </Box>
          </Box>

          {/* Time Slots */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom className="washatdoor-text">
              Select Time
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              p: 2
            }}>
              {/* AM/PM Toggle Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  fullWidth
                  variant={selectedTimePeriod === 'AM' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedTimePeriod('AM')}
                  sx={{ 
                    py: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    ...(selectedTimePeriod === 'AM' && {
                      backgroundColor: '#2e7d32',
                      borderColor: '#2e7d32',
                      '&:hover': {
                        backgroundColor: '#1b5e20',
                      },
                    }),
                  }}
                >
                  AM
                </Button>
                <Button
                  fullWidth
                  variant={selectedTimePeriod === 'PM' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedTimePeriod('PM')}
                  sx={{ 
                    py: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    ...(selectedTimePeriod === 'PM' && {
                      backgroundColor: '#2e7d32',
                      borderColor: '#2e7d32',
                      '&:hover': {
                        backgroundColor: '#1b5e20',
                      },
                    }),
                  }}
                >
                  PM
                </Button>
              </Box>

              {/* Time Slots Grid */}
              <Grid container spacing={1}>
                {timeSlots
                  .filter((time) => time.includes(selectedTimePeriod))
                  .map((time) => (
                    <Grid item xs={4} sm={3} md={2} key={time}>
                      <Button
                        fullWidth
                        variant={selectedTime === time ? 'contained' : 'outlined'}
                        onClick={() => setSelectedTime(time)}
                        sx={{ 
                          py: 0.5,
                          minWidth: 'unset',
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          fontSize: '0.875rem',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          ...(selectedTime === time && {
                            backgroundColor: '#2e7d32',
                            borderColor: '#2e7d32',
                            '&:hover': {
                              backgroundColor: '#1b5e20',
                            },
                          }),
                        }}
                      >
                        {time}
                      </Button>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Box>

          {/* Vehicle Type */}
          <Box sx={{ mb: 4 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" className="washatdoor-text">Vehicle Type</FormLabel>
              <RadioGroup
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <FormControlLabel value="Sedan" control={<Radio />} label="Sedan/Small Cars" />
                <FormControlLabel value="SUV" control={<Radio />} label="SUV" />
                <FormControlLabel value="Truck" control={<Radio />} label="Truck" />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* Package Selection */}
          <Box sx={{ mb: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="package-label" className="washatdoor-text">Select Package</InputLabel>
              <Select
                labelId="package-label"
                value={selectedPackage}
                label="Select Package"
                onChange={(e) => setSelectedPackage(e.target.value)}
              >
                <MenuItem value="Quick Wash">
                  Quick Wash - ${calculatePrice(packagePrices.sedan['Quick Wash'])}
                </MenuItem>
                <MenuItem value="Quick Wash + Vacuum">
                  Quick Wash + Vacuum - ${calculatePrice(packagePrices.sedan['Quick Wash + Vacuum'])}
                </MenuItem>
                <MenuItem value="Gold Wash">
                  Gold Wash - ${calculatePrice(packagePrices.sedan['Gold Wash'])}
                </MenuItem>
                <MenuItem value="Detailing">
                  Detailing - ${calculatePrice(packagePrices.sedan['Detailing'])}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Summary and Book Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom className="washatdoor-text">
              Booking Summary
            </Typography>
            <Typography variant="body1" gutterBottom>
              Date: {format(selectedDate, 'MMMM dd, yyyy')}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Time: {selectedTime}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Vehicle Type: {vehicleType}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Package: {selectedPackage}
            </Typography>
            <Typography variant="h6" gutterBottom className="washatdoor-text">
              Total: ${selectedPackage ? calculatePrice(packagePrices.sedan[selectedPackage]) : 0}
            </Typography>
            <Button
              variant="contained"
              size="large"
              className="washatdoor-text"
              sx={{ 
                mt: 2,
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20',
                },
              }}
              disabled={!selectedDate || !selectedTime || !vehicleType || !selectedPackage}
              onClick={handlePayment}
            >
              Proceed to Payment
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default BookingPage; 