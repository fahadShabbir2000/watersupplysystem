import express from 'express';
import Referral from '../models/referralSchema.js';

const router = express.Router();

// Create a referral
router.post('/', async (req, res) => {
    try {
        const newReferral = new Referral(req.body);
        const savedReferral = await newReferral.save();
        res.status(201).json(savedReferral);
    } catch (err) {
        res.status(400).json({ error: 'Error creating referral', message: err.message });
    }
});

// Get all referrals
router.get('/', async (req, res) => {
    try {
        const referrals = await Referral.find();
        res.json(referrals);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching referrals', message: err.message });
    }
});

// Get referral by ID
router.get('/:id', async (req, res) => {
    try {
        const referral = await Referral.findById(req.params.id);
        if (!referral) return res.status(404).json({ error: 'Referral not found' });
        res.json(referral);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching referral', message: err.message });
    }
});

// Update referral
router.put('/:id', async (req, res) => {
    try {
        const updatedReferral = await Referral.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReferral) return res.status(404).json({ error: 'Referral not found' });
        res.json(updatedReferral);
    } catch (err) {
        res.status(400).json({ error: 'Error updating referral', message: err.message });
    }
});

// Delete referral
router.delete('/:id', async (req, res) => {
    try {
        const deletedReferral = await Referral.findByIdAndDelete(req.params.id);
        if (!deletedReferral) return res.status(404).json({ error: 'Referral not found' });
        res.json(deletedReferral);
    } catch (err) {
        res.status(500).json({ error: 'Error deleting referral', message: err.message });
    }
});

export default router;
