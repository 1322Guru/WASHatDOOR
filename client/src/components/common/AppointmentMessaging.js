import React, { useState, useEffect, useRef } from 'react';
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
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { format } from 'date-fns';

const AppointmentMessaging = ({ appointmentId, userType, userName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Simulate loading messages from API
    const fetchMessages = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock messages data
        const mockMessages = [
          {
            id: 1,
            sender: 'customer',
            senderName: 'John Doe',
            content: 'Hi, I have a question about my appointment tomorrow.',
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          },
          {
            id: 2,
            sender: 'provider',
            senderName: 'Service Provider',
            content: 'Sure, what would you like to know?',
            timestamp: new Date(Date.now() - 3500000), // 55 minutes ago
          },
          {
            id: 3,
            sender: 'customer',
            senderName: 'John Doe',
            content: 'Will you bring your own water and supplies?',
            timestamp: new Date(Date.now() - 3400000), // 50 minutes ago
          },
          {
            id: 4,
            sender: 'provider',
            senderName: 'Service Provider',
            content: 'Yes, we bring all necessary supplies. Just make sure your vehicle is accessible.',
            timestamp: new Date(Date.now() - 3300000), // 45 minutes ago
          },
        ];
        
        setMessages(mockMessages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, [appointmentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setSending(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMsg = {
        id: messages.length + 1,
        sender: userType,
        senderName: userName,
        content: newMessage,
        timestamp: new Date(),
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );
  }

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
      <Typography variant="h6" gutterBottom className="washatdoor-text">
        Appointment Messages
      </Typography>
      
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
                  flexDirection: message.sender === userType ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  py: 1,
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: message.sender === userType ? '#2e7d32' : '#1976d2',
                    mr: message.sender === userType ? 0 : 1,
                    ml: message.sender === userType ? 1 : 0,
                  }}
                >
                  {getInitials(message.senderName)}
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
                      backgroundColor: message.sender === userType ? 'rgba(46, 125, 50, 0.3)' : 'rgba(25, 118, 210, 0.3)',
                      alignSelf: message.sender === userType ? 'flex-end' : 'flex-start',
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
                      alignSelf: message.sender === userType ? 'flex-end' : 'flex-start',
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
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          pt: 2,
        }}
      >
        <IconButton 
          size="small" 
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          <AttachFileIcon />
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
          sx={{ 
            mx: 1,
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
          endIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
          disabled={sending || !newMessage.trim()}
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

export default AppointmentMessaging; 