import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import axios from 'axios';
import AuthContext from '../../context/auth/authContext';

const AppointmentForm = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext;
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    date: null,
    startTime: null,
    endTime: null,
    notes: '',
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`/api/services/${serviceId}`);
        setService(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Service not found');
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        service: serviceId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        notes: formData.notes,
      };

      await axios.post('/api/appointments', appointmentData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response.data.msg || 'Error creating appointment');
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Book Appointment
          </Typography>
          <Typography variant="h6" gutterBottom>
            {service.name}
          </Typography>
          <Typography variant="body1" paragraph>
            Duration: {service.duration} minutes
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            ${service.price}
          </Typography>
          <form onSubmit={handleSubmit}>
            <DatePicker
              label="Date"
              value={formData.date}
              onChange={(newValue) => {
                setFormData({ ...formData, date: newValue });
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" required />
              )}
            />
            <TimePicker
              label="Start Time"
              value={formData.startTime}
              onChange={(newValue) => {
                setFormData({ ...formData, startTime: newValue });
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" required />
              )}
            />
            <TimePicker
              label="End Time"
              value={formData.endTime}
              onChange={(newValue) => {
                setFormData({ ...formData, endTime: newValue });
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" required />
              )}
            />
            <TextField
              fullWidth
              label="Additional Notes"
              name="notes"
              multiline
              rows={4}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              margin="normal"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Book Appointment
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AppointmentForm; 