import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Rating,
  Card,
  CardContent,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import UserMenu from '../common/UserMenu';

const ProviderRatings = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });

  // Mock data for ratings
  const ratings = [
    {
      id: 1,
      customerName: 'John Doe',
      rating: 5,
      comment: 'Excellent service! Very professional and thorough.',
      date: '2023-05-15',
      service: 'Premium Wash',
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      rating: 4,
      comment: 'Good service overall. Would recommend.',
      date: '2023-05-10',
      service: 'Basic Wash',
    },
    {
      id: 3,
      customerName: 'Mike Johnson',
      rating: 5,
      comment: "Best car wash service I've ever had!",
      date: '2023-05-05',
      service: 'Deluxe Package',
    },
  ];

  // Calculate average rating
  const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenReviewDialog = () => {
    setShowReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setShowReviewDialog(false);
    setNewReview({ rating: 0, comment: '' });
  };

  const handleReviewChange = (field) => (event) => {
    setNewReview({
      ...newReview,
      [field]: field === 'rating' ? Number(event.target.value) : event.target.value,
    });
  };

  const handleSubmitReview = () => {
    // Here you would typically send the review to your backend
    console.log('Submitting review:', newReview);
    handleCloseReviewDialog();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <UserMenu />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
            Ratings & Reviews
          </Typography>

          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            centered
            sx={{ mb: 4 }}
          >
            <Tab label="Ratings" />
            <Tab label="Reviews" />
          </Tabs>

          {selectedTab === 0 && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 4,
                  p: 3,
                  backgroundColor: 'rgba(46, 125, 50, 0.1)',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                  {averageRating.toFixed(1)}
                </Typography>
                <Rating value={averageRating} precision={0.1} readOnly size="large" />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Based on {ratings.length} reviews
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {ratings.map((rating) => (
                  <Grid item xs={12} md={6} key={rating.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ mr: 2 }}>{rating.customerName[0]}</Avatar>
                          <Box>
                            <Typography variant="h6">{rating.customerName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {rating.date}
                            </Typography>
                          </Box>
                        </Box>
                        <Rating value={rating.rating} readOnly />
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {rating.comment}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Service: {rating.service}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {selectedTab === 1 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenReviewDialog}
                  sx={{
                    backgroundColor: '#2e7d32',
                    '&:hover': {
                      backgroundColor: '#1b5e20',
                    },
                  }}
                >
                  Add New Review
                </Button>
              </Box>

              <Grid container spacing={3}>
                {ratings.map((rating) => (
                  <Grid item xs={12} md={6} key={rating.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ mr: 2 }}>{rating.customerName[0]}</Avatar>
                          <Box>
                            <Typography variant="h6">{rating.customerName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {rating.date}
                            </Typography>
                          </Box>
                        </Box>
                        <Rating value={rating.rating} readOnly />
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {rating.comment}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Service: {rating.service}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Paper>
      </Container>

      <Dialog open={showReviewDialog} onClose={handleCloseReviewDialog}>
        <DialogTitle>Add New Review</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={newReview.rating}
              onChange={handleReviewChange('rating')}
              size="large"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Comment"
              value={newReview.comment}
              onChange={handleReviewChange('comment')}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            sx={{
              backgroundColor: '#2e7d32',
              '&:hover': {
                backgroundColor: '#1b5e20',
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProviderRatings; 