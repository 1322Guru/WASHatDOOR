import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { format } from 'date-fns';

const ProviderAIChatbot = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      content: 'Hello! I\'m your WASHatDOOR assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(input);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          sender: 'bot',
          content: botResponse,
          timestamp: new Date(),
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const generateBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    // Basic responses based on keywords
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return 'Hello! How can I assist you with your service provider account today?';
    } else if (lowerInput.includes('appointment') || lowerInput.includes('schedule')) {
      return 'You can view and manage your appointments in the dashboard. The calendar shows all your scheduled services, and you can click on any appointment to see details or message the customer.';
    } else if (lowerInput.includes('customer') || lowerInput.includes('client')) {
      return 'You can view customer information in the appointment details. When you click on an appointment, you\'ll see the customer\'s name, contact information, and you can message them directly through the chat feature.';
    } else if (lowerInput.includes('payment') || lowerInput.includes('money') || lowerInput.includes('earn')) {
      return 'Payments are processed automatically through the platform. You\'ll receive your earnings after the service is completed and confirmed by the customer. You can view your earnings in the dashboard.';
    } else if (lowerInput.includes('profile') || lowerInput.includes('account')) {
      return 'You can update your profile information, including your contact details, service area, and service offerings in the profile settings section.';
    } else if (lowerInput.includes('service') || lowerInput.includes('offer')) {
      return 'You can customize your service offerings and pricing in the service settings. This allows you to define what services you provide and how much you charge for each.';
    } else if (lowerInput.includes('help') || lowerInput.includes('support')) {
      return 'If you need technical support or have questions about the platform, you can contact our support team through the help center or email support@washatdoor.com.';
    } else if (lowerInput.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    } else if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
      return 'Goodbye! Have a great day!';
    } else {
      return 'I\'m not sure I understand. Could you please rephrase your question? You can ask me about appointments, customers, payments, your profile, services, or support.';
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        content: 'Hello! I\'m your WASHatDOOR assistant. How can I help you today?',
        timestamp: new Date(),
      },
    ]);
  };

  if (!open) return null;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        height: '500px', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)',
        color: 'white',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" className="washatdoor-text">
          Provider Assistant
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={resetChat}
          sx={{ color: 'white', borderColor: 'white' }}
        >
          Reset Chat
        </Button>
      </Box>
      
      <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          mb: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.5)',
            },
          },
        }}
      >
        {messages.length > 0 ? (
          <List>
            {messages.map((message) => (
              <ListItem 
                key={message.id}
                sx={{ 
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  py: 1,
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: message.sender === 'user' ? '#2e7d32' : 'black',
                    mr: message.sender === 'user' ? 0 : 1,
                    ml: message.sender === 'user' ? 1 : 0,
                    width: 40,
                    height: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {message.sender === 'user' ? 'U' : (
                    <Box 
                      component="img" 
                      src="/text.png" 
                      alt="WASHatDOOR" 
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: 'brightness(0) invert(1)',
                      }} 
                    />
                  )}
                </Avatar>
                <Box 
                  sx={{ 
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2,
                      backgroundColor: message.sender === 'user' ? 'rgba(46, 125, 50, 0.3)' : 'rgba(25, 118, 210, 0.3)',
                      alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Typography variant="body1">
                      {message.content}
                    </Typography>
                  </Paper>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      mt: 0.5, 
                      alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {format(message.timestamp, 'h:mm a')}
                  </Typography>
                </Box>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        ) : (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="100%"
          >
            <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
              Start a conversation with the AI assistant!
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          pt: 2,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question..."
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          sx={{ 
            mr: 1,
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
          endIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
          disabled={isLoading || !input.trim()}
          sx={{ 
            backgroundColor: '#2e7d32',
            '&:hover': {
              backgroundColor: '#1b5e20',
            },
          }}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ProviderAIChatbot; 