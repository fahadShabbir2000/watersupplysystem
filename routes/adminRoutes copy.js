import express from 'express';
import Admin from '../models/adminSchema.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Create an admin
router.post('/', async (req, res) => {
    try {
        const newAdmin = new Admin(req.body);
        const savedAdmin = await newAdmin.save();
        res.status(201).json(savedAdmin);
    } catch (err) {
        res.status(400).json({ error: 'Error creating admin', message: err.message });
    }
});

// Get all admins
router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching admins', message: err.message });
    }
});

// Get admin by ID
router.get('/:id', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ error: 'Admin not found' });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching admin', message: err.message });
    }
});

// Update admin
router.put('/:id', authorizeRoles('admin', 'superadmin', 'deliveryboy'), async (req, res) => {
    try {
        const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAdmin) return res.status(404).json({ error: 'Admin not found' });
        res.json(updatedAdmin);
    } catch (err) {
        res.status(400).json({ error: 'Error updating admin', message: err.message });
    }
});

// Delete admin
router.delete('/:id', async (req, res) => {
    try {
        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
        if (!deletedAdmin) return res.status(404).json({ error: 'Admin not found' });
        res.json(deletedAdmin);
    } catch (err) {
        res.status(500).json({ error: 'Error deleting admin', message: err.message });
    }
});

export default router;
