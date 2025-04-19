import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
  Divider,
} from '@mui/material';
import axios from 'axios';

const ServiceDetail = () => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`/api/services/${id}`);
        setService(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

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

  if (!service) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Service not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {service.name}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {service.description}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Service Provider
            </Typography>
            <Typography variant="body1" paragraph>
              Name: {service.serviceProvider.name}
            </Typography>
            <Typography variant="body1" paragraph>
              Phone: {service.serviceProvider.phone}
            </Typography>
            <Typography variant="body1" paragraph>
              Address: {service.serviceProvider.address}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Service Details
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                ${service.price}
              </Typography>
              <Typography variant="body1" paragraph>
                Duration: {service.duration} minutes
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                component={RouterLink}
                to={`/appointments/new/${service._id}`}
                sx={{ mt: 2 }}
              >
                Book Now
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ServiceDetail; 