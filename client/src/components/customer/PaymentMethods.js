import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Divider,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Chip,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import UserMenu from '../common/UserMenu';

const PaymentMethods = () => {
  // Mock data for saved cards
  const [cards, setCards] = useState([
    { id: 1, cardNumber: '**** **** **** 1234', cardType: 'Visa', expiryDate: '12/25', isDefault: true },
    { id: 2, cardNumber: '**** **** **** 5678', cardType: 'Mastercard', expiryDate: '08/26', isDefault: false },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleOpenDialog = (card = null) => {
    if (card) {
      setEditingCard(card);
      setNewCard({
        cardNumber: '1234 5678 9012 3456', // In a real app, this would be masked
        cardHolder: 'John Doe',
        expiryDate: card.expiryDate,
        cvv: '',
      });
    } else {
      setEditingCard(null);
      setNewCard({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCard(null);
    setNewCard({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    });
  };

  const handleChange = (e) => {
    setNewCard({
      ...newCard,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCard) {
      // Update existing card
      const updatedCards = cards.map(card => 
        card.id === editingCard.id 
          ? { ...card, expiryDate: newCard.expiryDate } 
          : card
      );
      setCards(updatedCards);
      setSnackbar({
        open: true,
        message: 'Card updated successfully!',
        severity: 'success',
      });
    } else {
      // Add new card
      const newCardId = Math.max(...cards.map(card => card.id)) + 1;
      const cardType = newCard.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';
      const maskedCardNumber = `**** **** **** ${newCard.cardNumber.slice(-4)}`;
      
      setCards([
        ...cards,
        { 
          id: newCardId, 
          cardNumber: maskedCardNumber, 
          cardType, 
          expiryDate: newCard.expiryDate,
          isDefault: false,
        }
      ]);
      setSnackbar({
        open: true,
        message: 'Card added successfully!',
        severity: 'success',
      });
    }
    
    handleCloseDialog();
  };

  const handleDeleteCard = (cardId) => {
    setCards(cards.filter(card => card.id !== cardId));
    setSnackbar({
      open: true,
      message: 'Card deleted successfully!',
      severity: 'success',
    });
  };

  const handleSetDefault = (cardId) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === cardId,
    })));
    setSnackbar({
      open: true,
      message: 'Default card updated!',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
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
            Payment Methods
          </Typography>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 3 }} />
          
          <Box sx={{ mb: 4 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              className="washatdoor-text"
              sx={{ 
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20',
                },
              }}
            >
              Add New Card
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {cards.map((card) => (
              <Grid item xs={12} sm={6} key={card.id}>
                <Card 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(5px)',
                    color: 'white',
                    border: card.isDefault ? '1px solid #2e7d32' : '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CreditCardIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        {card.cardType}
                      </Typography>
                      {card.isDefault && (
                        <Chip 
                          label="Default" 
                          size="small" 
                          sx={{ 
                            ml: 1, 
                            backgroundColor: '#2e7d32',
                            color: 'white',
                          }} 
                        />
                      )}
                    </Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {card.cardNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expires: {card.expiryDate}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {!card.isDefault && (
                      <Button 
                        size="small" 
                        onClick={() => handleSetDefault(card.id)}
                        sx={{ color: 'white' }}
                      >
                        Set as Default
                      </Button>
                    )}
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog(card)}
                      sx={{ color: 'white', ml: 'auto' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteCard(card.id)}
                      sx={{ color: 'white' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
      
      {/* Add/Edit Card Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'white',
          }
        }}
      >
        <DialogTitle className="washatdoor-text">
          {editingCard ? 'Edit Card' : 'Add New Card'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Card Number"
              name="cardNumber"
              value={newCard.cardNumber}
              onChange={handleChange}
              disabled={!!editingCard}
              sx={{
                mb: 2,
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
              }}
            />
            <TextField
              fullWidth
              label="Card Holder Name"
              name="cardHolder"
              value={newCard.cardHolder}
              onChange={handleChange}
              disabled={!!editingCard}
              sx={{
                mb: 2,
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
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Date (MM/YY)"
                  name="expiryDate"
                  value={newCard.expiryDate}
                  onChange={handleChange}
                  sx={{
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
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  name="cvv"
                  value={newCard.cvv}
                  onChange={handleChange}
                  type="password"
                  sx={{
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
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
            sx={{ color: 'white' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            className="washatdoor-text"
            sx={{ 
              backgroundColor: '#2e7d32',
              '&:hover': {
                backgroundColor: '#1b5e20',
              },
            }}
          >
            {editingCard ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentMethods; 