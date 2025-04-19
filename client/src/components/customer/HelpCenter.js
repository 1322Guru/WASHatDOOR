import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import UserMenu from '../common/UserMenu';
import AIChatbotAvatar from '../common/AIChatbotAvatar';

const HelpCenter = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Hello! I\'m your AI assistant. How can I help you today?', 
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date(),
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userInput) => {
    // Simple response logic - in a real app, this would call an AI API
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('booking') || lowerInput.includes('appointment')) {
      return 'To book a car wash appointment, go to the Booking page and select your preferred date, time, and service package. You can also choose your vehicle type and see pricing information.';
    } else if (lowerInput.includes('payment') || lowerInput.includes('card')) {
      return 'You can manage your payment methods in the Payment Methods section. There you can add, update, or remove your saved cards.';
    } else if (lowerInput.includes('cancel') || lowerInput.includes('reschedule')) {
      return 'To cancel or reschedule an appointment, go to your Service History and find the appointment you want to modify. You can cancel up to 24 hours before your scheduled time without any charge.';
    } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
      return 'Our pricing varies based on the service package and vehicle type. Basic packages start at $50 for sedans, with a 20% increase for SUVs and 35% for trucks. You can see detailed pricing when booking a service.';
    } else if (lowerInput.includes('service') || lowerInput.includes('wash')) {
      return 'We offer several service packages including Quick Wash, Quick Wash + Vacuum, Gold Wash, and Detailing. Each package includes different services and has different pricing.';
    } else if (lowerInput.includes('history') || lowerInput.includes('past')) {
      return 'You can view your service history in the Service History section. There you can see all your past appointments and provide ratings and feedback for services you\'ve received.';
    } else if (lowerInput.includes('address') || lowerInput.includes('location')) {
      return 'You can update your service address in the Update Address section. This is where our service providers will come to wash your vehicle.';
    } else if (lowerInput.includes('profile') || lowerInput.includes('account')) {
      return 'You can manage your profile information, including your name, email, and phone number, in the Manage Profile section.';
    } else if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    } else {
      return 'I\'m not sure I understand. Could you please rephrase your question? You can ask about booking appointments, payment methods, service packages, pricing, or account management.';
    }
  };

  const handleReset = () => {
    setMessages([
      { 
        id: 1, 
        text: 'Hello! I\'m your AI assistant. How can I help you today?', 
        sender: 'ai',
        timestamp: new Date(),
      }
    ]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            height: '70vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" className="washatdoor-text">
              Help Center
            </Typography>
            <Tooltip title="Reset conversation">
              <IconButton onClick={handleReset} sx={{ color: 'white' }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
          
          <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
            <List>
              {messages.map((message) => (
                <ListItem 
                  key={message.id}
                  sx={{ 
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemAvatar>
                    {message.sender === 'user' ? (
                      <Avatar sx={{ bgcolor: 'primary.main' }}>U</Avatar>
                    ) : (
                      <AIChatbotAvatar size={40} />
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          backgroundColor: message.sender === 'user' 
                            ? 'rgba(46, 125, 50, 0.3)' 
                            : 'rgba(25, 118, 210, 0.3)',
                          maxWidth: '80%',
                          ml: message.sender === 'user' ? 'auto' : 0,
                          mr: message.sender === 'user' ? 0 : 'auto',
                        }}
                      >
                        <Typography variant="body1">{message.text}</Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                          {formatTime(message.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
              {isLoading && (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#1976d2' }}>
                      <SmartToyIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                        <Typography variant="body2">AI is typing...</Typography>
                      </Box>
                    }
                  />
                </ListItem>
              )}
              <div ref={messagesEndRef} />
            </List>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Ask a question..."
              value={input}
              onChange={handleChange}
              disabled={isLoading}
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
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !input.trim()}
              sx={{ 
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20',
                },
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HelpCenter; 