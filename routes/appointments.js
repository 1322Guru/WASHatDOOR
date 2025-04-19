const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const User = require('../models/User');

// @route   GET api/appointments
// @desc    Get all appointments for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        let appointments;

        if (user.role === 'customer') {
            appointments = await Appointment.find({ customer: req.user.id })
                .populate('service')
                .populate('serviceProvider', ['name', 'phone', 'address']);
        } else {
            appointments = await Appointment.find({ serviceProvider: req.user.id })
                .populate('service')
                .populate('customer', ['name', 'phone']);
        }

        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('service')
            .populate('customer', ['name', 'phone'])
            .populate('serviceProvider', ['name', 'phone', 'address']);

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        // Check if user is authorized to view this appointment
        const user = await User.findById(req.user.id);
        if (user.role === 'customer' && appointment.customer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        if (user.role === 'service_provider' && appointment.serviceProvider.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Appointment not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/appointments
// @desc    Create an appointment
// @access  Private
router.post('/', [
    auth,
    [
        check('service', 'Service is required').not().isEmpty(),
        check('date', 'Date is required').not().isEmpty(),
        check('startTime', 'Start time is required').not().isEmpty(),
        check('endTime', 'End time is required').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'customer') {
            return res.status(403).json({ msg: 'Only customers can create appointments' });
        }

        const service = await Service.findById(req.body.service);
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }

        // Check if the time slot is available
        const existingAppointment = await Appointment.findOne({
            service: req.body.service,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            status: { $nin: ['cancelled'] }
        });

        if (existingAppointment) {
            return res.status(400).json({ msg: 'Time slot is not available' });
        }

        const newAppointment = new Appointment({
            customer: req.user.id,
            service: req.body.service,
            serviceProvider: service.serviceProvider,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            totalPrice: service.price,
            notes: req.body.notes
        });

        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/appointments/:id
// @desc    Update appointment status
// @access  Private
router.put('/:id', [
    auth,
    [
        check('status', 'Status is required').isIn(['pending', 'confirmed', 'completed', 'cancelled'])
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        const user = await User.findById(req.user.id);
        
        // Only service provider can update appointment status
        if (user.role !== 'service_provider' || appointment.serviceProvider.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        appointment.status = req.body.status;
        await appointment.save();

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Appointment not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/appointments/:id
// @desc    Delete an appointment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        const user = await User.findById(req.user.id);
        
        // Only customer can delete their own appointments
        if (user.role !== 'customer' || appointment.customer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await appointment.remove();
        res.json({ msg: 'Appointment removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Appointment not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router; 