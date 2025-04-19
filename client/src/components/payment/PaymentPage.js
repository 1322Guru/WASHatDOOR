import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe with the publishable key from environment variables
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');

const PaymentForm = ({ bookingDetails, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/payment/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: bookingDetails.total })
    })
      .then(res => res.json())
      .then(data => {
        setClientSecret(data.clientSecret);
      })
      .catch(err => {
        setError('Failed to initialize payment. Please try again.');
        console.error('Error:', err);
      });
  }, [bookingDetails.total]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          // You can collect billing details here if needed
        },
      }
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 3 }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#ffffff',
                '::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              },
              invalid: {
                color: '#ff3d00',
              },
            },
          }}
        />
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        className="washatdoor-text"
        disabled={!stripe || processing || !clientSecret}
      >
        {processing ? 'Processing...' : `Pay $${bookingDetails.total}`}
      </Button>
    </form>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};

  const handlePaymentSuccess = () => {
    navigate('/booking-confirmation', { state: { bookingDetails } });
  };

  if (!bookingDetails) {
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
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" gutterBottom className="washatdoor-text">
              No Booking Details Found
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/booking')}
              className="washatdoor-text"
              sx={{ mt: 2 }}
            >
              Return to Booking
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

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
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography 
            variant="h4" 
            className="washatdoor-text"
            sx={{ 
              mb: 4,
              textAlign: 'center',
            }}
          >
            WASHatDOOR
          </Typography>
        </Box>
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
            Secure Payment
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom className="washatdoor-text">
              Booking Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">Date:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{bookingDetails.date}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Time:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{bookingDetails.time}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Vehicle Type:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{bookingDetails.vehicleType}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Package:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{bookingDetails.package}</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" className="washatdoor-text">Total Amount:</Typography>
              <Typography variant="h6" className="washatdoor-text">${bookingDetails.total}</Typography>
            </Box>
          </Box>

          <Elements stripe={stripePromise}>
            <PaymentForm bookingDetails={bookingDetails} onSuccess={handlePaymentSuccess} />
          </Elements>
        </Paper>
      </Container>
    </Box>
  );
};

export default PaymentPage; 