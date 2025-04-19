import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import UserMenu from '../common/UserMenu';

const TestRoute = () => {
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
      <Container maxWidth="md" sx={{ pt: 10, pb: 5 }}>
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
            Test Route
          </Typography>
          <Typography variant="body1" align="center">
            This is a test route to verify that the routing is working correctly.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default TestRoute; 