const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Provider = require('../models/Provider');
const { OAuth2Client } = require('google-auth-library');
const twilio = require('twilio');

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Initialize Twilio client for SMS verification
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('phone', 'Phone number is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      // Create new user
      user = new User({
        name,
        email,
        password,
        phone,
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user to database
      await user.save();

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
          type: 'customer',
        },
      };

      // Sign token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '24h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/register/provider
// @desc    Register a service provider
// @access  Public
router.post(
  '/register/provider',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('serviceArea', 'Service area is required').not().isEmpty(),
    check('services', 'Services are required').isArray(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, serviceArea, services, description } = req.body;

    try {
      // Check if provider exists
      let provider = await Provider.findOne({ email });

      if (provider) {
        return res.status(400).json({ errors: [{ msg: 'Provider already exists' }] });
      }

      // Create new provider
      provider = new Provider({
        name,
        email,
        password,
        phone,
        serviceArea,
        services,
        description: description || '',
        isVerified: false,
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      provider.password = await bcrypt.hash(password, salt);

      // Save provider to database
      await provider.save();

      // Create JWT payload
      const payload = {
        user: {
          id: provider.id,
          type: 'provider',
        },
      };

      // Sign token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '24h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      let userType = 'customer';

      // If not found in User model, check Provider model
      if (!user) {
        user = await Provider.findOne({ email });
        userType = 'provider';
      }

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
          type: userType,
        },
      };

      // Sign token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '24h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token, userType });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let user;
    
    if (req.user.type === 'customer') {
      user = await User.findById(req.user.id).select('-password');
    } else {
      user = await Provider.findById(req.user.id).select('-password');
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/google
// @desc    Authenticate with Google
// @access  Public
router.post('/google', async (req, res) => {
  const { token, userType } = req.body;

  try {
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    // Check if user exists
    let user;
    let isNewUser = false;

    if (userType === 'user') {
      user = await User.findOne({ email });
      
      if (!user) {
        // Create new user
        user = new User({
          name,
          email,
          password: Math.random().toString(36).slice(-8), // Random password
          googleId: payload.sub,
          profilePicture: picture
        });
        
        await user.save();
        isNewUser = true;
      }
    } else {
      user = await Provider.findOne({ email });
      
      if (!user) {
        // Create new provider
        user = new Provider({
          name,
          email,
          password: Math.random().toString(36).slice(-8), // Random password
          googleId: payload.sub,
          profilePicture: picture
        });
        
        await user.save();
        isNewUser = true;
      }
    }

    // Create JWT payload
    const jwtPayload = {
      user: {
        id: user.id,
        type: userType
      }
    };

    // Sign token
    jwt.sign(
      jwtPayload,
      config.get('jwtSecret'),
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          isNewUser,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            type: userType
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/facebook
// @desc    Authenticate with Facebook
// @access  Public
router.post('/facebook', async (req, res) => {
  const { accessToken, userType } = req.body;

  try {
    // Verify Facebook token and get user data
    const response = await fetch(`https://graph.facebook.com/v12.0/me?fields=id,name,email,picture&access_token=${accessToken}`);
    const data = await response.json();
    
    if (data.error) {
      return res.status(400).json({ msg: 'Invalid Facebook token' });
    }

    const { id, name, email, picture } = data;

    // Check if user exists
    let user;
    let isNewUser = false;

    if (userType === 'user') {
      user = await User.findOne({ email });
      
      if (!user) {
        // Create new user
        user = new User({
          name,
          email,
          password: Math.random().toString(36).slice(-8), // Random password
          facebookId: id,
          profilePicture: picture?.data?.url
        });
        
        await user.save();
        isNewUser = true;
      }
    } else {
      user = await Provider.findOne({ email });
      
      if (!user) {
        // Create new provider
        user = new Provider({
          name,
          email,
          password: Math.random().toString(36).slice(-8), // Random password
          facebookId: id,
          profilePicture: picture?.data?.url
        });
        
        await user.save();
        isNewUser = true;
      }
    }

    // Create JWT payload
    const jwtPayload = {
      user: {
        id: user.id,
        type: userType
      }
    };

    // Sign token
    jwt.sign(
      jwtPayload,
      config.get('jwtSecret'),
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          isNewUser,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            type: userType
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/apple
// @desc    Authenticate with Apple
// @access  Public
router.post('/apple', async (req, res) => {
  const { identityToken, userType } = req.body;

  try {
    // Verify Apple token (simplified for this example)
    // In a real app, you would use a library like apple-signin-auth to verify the token
    const decodedToken = JSON.parse(Buffer.from(identityToken.split('.')[1], 'base64').toString());
    const { sub, email, name } = decodedToken;

    // Check if user exists
    let user;
    let isNewUser = false;

    if (userType === 'user') {
      user = await User.findOne({ email });
      
      if (!user) {
        // Create new user
        user = new User({
          name: name?.firstName ? `${name.firstName} ${name.lastName || ''}` : 'Apple User',
          email,
          password: Math.random().toString(36).slice(-8), // Random password
          appleId: sub
        });
        
        await user.save();
        isNewUser = true;
      }
    } else {
      user = await Provider.findOne({ email });
      
      if (!user) {
        // Create new provider
        user = new Provider({
          name: name?.firstName ? `${name.firstName} ${name.lastName || ''}` : 'Apple User',
          email,
          password: Math.random().toString(36).slice(-8), // Random password
          appleId: sub
        });
        
        await user.save();
        isNewUser = true;
      }
    }

    // Create JWT payload
    const jwtPayload = {
      user: {
        id: user.id,
        type: userType
      }
    };

    // Sign token
    jwt.sign(
      jwtPayload,
      config.get('jwtSecret'),
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          isNewUser,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            type: userType
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/send-verification
// @desc    Send phone verification code
// @access  Public
router.post('/send-verification', async (req, res) => {
  const { phone } = req.body;

  try {
    // Generate a random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the code in the database or cache (simplified for this example)
    // In a real app, you would store this in Redis or a similar cache with an expiration
    
    // Send SMS via Twilio
    await twilioClient.messages.create({
      body: `Your WASH at DOOR verification code is: ${verificationCode}`,
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    
    res.json({ msg: 'Verification code sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/verify-phone
// @desc    Verify phone number with code
// @access  Public
router.post('/verify-phone', async (req, res) => {
  const { phone, code } = req.body;

  try {
    // In a real app, you would verify the code against what was stored
    // For this example, we'll just return success
    
    res.json({ verified: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 