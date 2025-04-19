const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Provider = require('../models/Provider');
const Appointment = require('../models/Appointment');
const EmergencyAlert = require('../models/EmergencyAlert');

// Get all appointments for a provider
router.get('/appointments', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ provider: req.user.id })
      .populate('customer', 'name phone')
      .sort({ serviceDate: 1 });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get appointments for a specific date
router.get('/appointments/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const appointments = await Appointment.find({
      provider: req.user.id,
      serviceDate: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).populate('customer', 'name phone');

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update appointment status
router.put('/appointments/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Make sure provider owns the appointment
    if (appointment.provider.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Send emergency alert
router.post('/emergency', auth, async (req, res) => {
  try {
    const { location } = req.body;

    const emergencyAlert = new EmergencyAlert({
      provider: req.user.id,
      location,
      status: 'active'
    });

    await emergencyAlert.save();

    // In a real app, this would trigger notifications to admin/emergency services
    res.json(emergencyAlert);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Start service delivery
router.post('/appointments/:id/deliver', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Make sure provider owns the appointment
    if (appointment.provider.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    appointment.status = 'in-progress';
    appointment.startTime = new Date();
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 