import express from 'express';
import Notification from '../models/notificationSchema.js';

const router = express.Router();

// Create a notification
router.post('/', async (req, res) => {
    try {
        const newNotification = new Notification(req.body);
        const savedNotification = await newNotification.save();
        res.status(201).json(savedNotification);
    } catch (err) {
        res.status(400).json({ error: 'Error creating notification', message: err.message });
    }
});

// Get all notifications
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching notifications', message: err.message });
    }
});

// Get notification by ID
router.get('/:id', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ error: 'Notification not found' });
        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching notification', message: err.message });
    }
});

// Update notification
router.put('/:id', async (req, res) => {
    try {
        const updatedNotification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNotification) return res.status(404).json({ error: 'Notification not found' });
        res.json(updatedNotification);
    } catch (err) {
        res.status(400).json({ error: 'Error updating notification', message: err.message });
    }
});

// Delete notification
router.delete('/:id', async (req, res) => {
    try {
        const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
        if (!deletedNotification) return res.status(404).json({ error: 'Notification not found' });
        res.json(deletedNotification);
    } catch (err) {
        res.status(500).json({ error: 'Error deleting notification', message: err.message });
    }
});

export default router;
