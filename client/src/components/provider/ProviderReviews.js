import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Rating,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import UserMenu from '../common/UserMenu';

const ProviderReviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      customerName: 'Alice Johnson',
      rating: 5,
      comment: 'Excellent service! The car was spotless and the staff was very professional.',
      date: '2024-03-15',
      service: 'Gold Wash',
      status: 'published',
    },
    {
      id: 2,
      customerName: 'Bob Smith',
      rating: 4,
      comment: 'Good service overall. Would recommend to others.',
      date: '2024-03-14',
      service: 'Quick Wash',
      status: 'pending',
    },
    {
      id: 3,
      customerName: 'Carol White',
      rating: 5,
      comment: 'Amazing attention to detail. Will definitely use again!',
      date: '2024-03-13',
      service: 'Detailing',
      status: 'published',
    },
  ]);

  const [selectedReview, setSelectedReview] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reply, setReply] = useState('');

  const handleReviewClick = (review) => {
    setSelectedReview(review);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedReview(null);
    setReply('');
  };

  const handleReplySubmit = () => {
    if (selectedReview && reply) {
      // TODO: Implement reply submission logic
      console.log('Submitting reply:', { reviewId: selectedReview.id, reply });
      handleCloseDialog();
    }
  };

  const handleStatusChange = (reviewId, newStatus) => {
    // TODO: Implement status change logic
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, status: newStatus } : review
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return '#2e7d32';
      case 'pending':
        return '#ed6c02';
      case 'rejected':
        return '#d32f2f';
      default:
        return '#757575';
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
            Customer Reviews
          </Typography>

          <Grid container spacing={3}>
            {reviews.map((review) => (
              <Grid item xs={12} key={review.id}>
                <Card 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                  onClick={() => handleReviewClick(review)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            mr: 2,
                          }}
                        >
                          {review.customerName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            {review.customerName}
                          </Typography>
                          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                            {review.date} - {review.service}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={review.status}
                        sx={{
                          backgroundColor: getStatusColor(review.status),
                          color: 'white',
                          textTransform: 'capitalize',
                        }}
                      />
                    </Box>
                    <Rating 
                      value={review.rating} 
                      readOnly 
                      sx={{ 
                        '& .MuiRating-iconFilled': {
                          color: '#2e7d32',
                        },
                      }}
                    />
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {review.comment}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Review Details Dialog */}
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
        {selectedReview && (
          <>
            <DialogTitle>
              <Typography variant="h5" className="washatdoor-text">
                Review Details
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      mr: 2,
                    }}
                  >
                    {selectedReview.customerName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {selectedReview.customerName}
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                      {selectedReview.date} - {selectedReview.service}
                    </Typography>
                  </Box>
                </Box>
                <Rating 
                  value={selectedReview.rating} 
                  readOnly 
                  sx={{ 
                    mb: 2,
                    '& .MuiRating-iconFilled': {
                      color: '#2e7d32',
                    },
                  }}
                />
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {selectedReview.comment}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Reply to Review"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
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
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => handleStatusChange(selectedReview.id, 'rejected')}
                variant="outlined"
                sx={{ 
                  color: '#d32f2f',
                  borderColor: '#d32f2f',
                  '&:hover': {
                    borderColor: '#d32f2f',
                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  },
                }}
              >
                Reject
              </Button>
              <Button
                onClick={() => handleStatusChange(selectedReview.id, 'published')}
                variant="outlined"
                sx={{ 
                  color: '#2e7d32',
                  borderColor: '#2e7d32',
                  '&:hover': {
                    borderColor: '#2e7d32',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                  },
                }}
              >
                Publish
              </Button>
              <Button
                onClick={handleReplySubmit}
                variant="contained"
                disabled={!reply}
                sx={{
                  backgroundColor: '#2e7d32',
                  '&:hover': {
                    backgroundColor: '#1b5e20',
                  },
                }}
              >
                Reply
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ProviderReviews; 