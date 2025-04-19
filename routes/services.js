const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Service = require('../models/Service');
const User = require('../models/User');

// @route   GET api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
    try {
        const services = await Service.find()
            .populate('serviceProvider', ['name', 'phone', 'address']);
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('serviceProvider', ['name', 'phone', 'address']);
        
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }
        
        res.json(service);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Service not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/services
// @desc    Create a service
// @access  Private (Service Provider only)
router.post('/', [
    auth,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('duration', 'Duration is required').isNumeric(),
        check('price', 'Price is required').isNumeric()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'service_provider') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const newService = new Service({
            name: req.body.name,
            description: req.body.description,
            duration: req.body.duration,
            price: req.body.price,
            serviceProvider: req.user.id
        });

        const service = await newService.save();
        res.json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/services/:id
// @desc    Update a service
// @access  Private (Service Provider only)
router.put('/:id', [
    auth,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('duration', 'Duration is required').isNumeric(),
        check('price', 'Price is required').isNumeric()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let service = await Service.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }

        // Make sure user owns the service
        if (service.serviceProvider.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        service = await Service.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(service);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Service not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/services/:id
// @desc    Delete a service
// @access  Private (Service Provider only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }

        // Make sure user owns the service
        if (service.serviceProvider.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await service.remove();
        res.json({ msg: 'Service removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Service not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router; 