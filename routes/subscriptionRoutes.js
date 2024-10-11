import express from 'express';
import Subscription from '../models/subscriptionSchema.js';

const router = express.Router();

// Create a subscription
router.post('/', async (req, res) => {
    try {
        const newSubscription = new Subscription(req.body);
        const savedSubscription = await newSubscription.save();
        res.status(201).json(savedSubscription);
    } catch (err) {
        res.status(400).json({ error: 'Error creating subscription', message: err.message });
    }
});

// Get all subscriptions
router.get('/', async (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        res.json(subscriptions);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching subscriptions', message: err.message });
    }
});

// Get subscription by ID
router.get('/:id', async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) return res.status(404).json({ error: 'Subscription not found' });
        res.json(subscription);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching subscription', message: err.message });
    }
});

// Update subscription
router.put('/:id', async (req, res) => {
    try {
        const updatedSubscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSubscription) return res.status(404).json({ error: 'Subscription not found' });
        res.json(updatedSubscription);
    } catch (err) {
        res.status(400).json({ error: 'Error updating subscription', message: err.message });
    }
});

// Delete subscription
router.delete('/:id', async (req, res) => {
    try {
        const deletedSubscription = await Subscription.findByIdAndDelete(req.params.id);
        if (!deletedSubscription) return res.status(404).json({ error: 'Subscription not found' });
        res.json(deletedSubscription);
    } catch (err) {
        res.status(500).json({ error: 'Error deleting subscription', message: err.message });
    }
});

export default router;
