import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
} from '@mui/material';
import {
  LocalCarWash,
  Schedule,
  Payment,
  Star,
} from '@mui/icons-material';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                WASHatDOOR
              </Typography>
              <Typography variant="h5" paragraph>
                Professional car wash services at your doorstep. Book your appointment
                now and experience the convenience of mobile car washing.
              </Typography>
              <Button
                component={RouterLink}
                to="/services"
                variant="contained"
                color="secondary"
                size="large"
                sx={{ mt: 2 }}
              >
                Browse Services
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/car-wash-hero.jpg"
                alt="Car Wash"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Why Choose WASHatDOOR?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <LocalCarWash sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" align="center" gutterBottom>
                Mobile Service
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary">
                We come to your location, saving you time and effort.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Schedule sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" align="center" gutterBottom>
                Easy Booking
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary">
                Simple online booking system with flexible scheduling.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Payment sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" align="center" gutterBottom>
                Competitive Pricing
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary">
                Quality service at affordable prices.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Star sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" align="center" gutterBottom>
                Professional Service
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary">
                Experienced and trained service providers.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Join thousands of satisfied customers who trust WASHatDOOR for their car
            washing needs.
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mr: 2 }}
            >
              Sign Up Now
            </Button>
            <Button
              component={RouterLink}
              to="/services"
              variant="outlined"
              color="primary"
              size="large"
            >
              View Services
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 