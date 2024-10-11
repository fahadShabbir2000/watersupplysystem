import express from 'express';
import Payment from '../models/paymentSchema.js';

const router = express.Router();

// Create a payment
router.post('/', async (req, res) => {
    try {
        const newPayment = new Payment(req.body);
        const savedPayment = await newPayment.save();
        res.status(201).json(savedPayment);
    } catch (err) {
        res.status(400).json({ error: 'Error creating payment', message: err.message });
    }
});

// Get all payments
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching payments', message: err.message });
    }
});

// Get payment by ID
router.get('/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ error: 'Payment not found' });
        res.json(payment);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching payment', message: err.message });
    }
});

// Update payment
router.put('/:id', async (req, res) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPayment) return res.status(404).json({ error: 'Payment not found' });
        res.json(updatedPayment);
    } catch (err) {
        res.status(400).json({ error: 'Error updating payment', message: err.message });
    }
});

// Delete payment
router.delete('/:id', async (req, res) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
        if (!deletedPayment) return res.status(404).json({ error: 'Payment not found' });
        res.json(deletedPayment);
    } catch (err) {
        res.status(500).json({ error: 'Error deleting payment', message: err.message });
    }
});

export default router;
