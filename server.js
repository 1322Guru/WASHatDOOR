const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/washatdoor', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Test route for root path
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>WASH at DOOR API Server</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
          }
          h1 {
            color: #2e7d32;
          }
          .endpoint {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <h1>WASH at DOOR API Server</h1>
        <p>This is the backend API server for the WASH at DOOR application.</p>
        <p>The frontend application is running at <a href="http://localhost:3000">http://localhost:3000</a></p>
        
        <h2>Available API Endpoints:</h2>
        <div class="endpoint">
          <strong>Authentication:</strong>
          <ul>
            <li>POST /api/auth/register - Register a new user</li>
            <li>POST /api/auth/login - Login a user</li>
            <li>GET /api/auth/me - Get current user</li>
          </ul>
        </div>
        
        <div class="endpoint">
          <strong>Appointments:</strong>
          <ul>
            <li>GET /api/appointments - Get all appointments</li>
            <li>POST /api/appointments - Create a new appointment</li>
          </ul>
        </div>
        
        <div class="endpoint">
          <strong>Services:</strong>
          <ul>
            <li>GET /api/services - Get all services</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/services', require('./routes/services'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 