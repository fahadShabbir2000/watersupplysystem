import express from 'express';
import bcrypt from 'bcrypt';
import Admin from '../models/adminSchema.js';

const router = express.Router();

// Create an admin (POST /api/admins)
router.post('/', async (req, res) => {
    try {
        // Find the last admin and increment the AdminID
        const lastAdmin = await Admin.findOne().sort({ AdminID: -1 }).exec();
        const newAdminId = lastAdmin ? lastAdmin.AdminID + 1 : 1; // Start with 1 if no admin exists

        // Extract the password from the request body & Check if the password is provided
        const { Password } = req.body;
        if (!Password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(Password, 10); // 10 is the salt rounds

        // Create the new admin with the incremented AdminID and hashed password
        const newAdmin = new Admin({ ...req.body, AdminID: newAdminId, Password: hashedPassword });

        const savedAdmin = await newAdmin.save();
        res.status(201).json(savedAdmin);
    } catch (err) {
        res.status(400).json({ error: 'Error creating admin', message: err.message });
    }
});

// Get all admins (GET /api/admins)
router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching admins', message: err.message });
    }
});

// Get admin by ID (GET /api/admins/:id)
router.get('/:id', async (req, res) => {
    try {
        const admin = await Admin.findOne({ AdminID: req.params.id }); // Changed to AdminID
        if (!admin) return res.status(404).json({ error: 'Admin not found' });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching admin', message: err.message });
    }
});

// Update admin (PUT /api/admins/:id)
router.put('/:id', async (req, res) => {
    try {
        const updatedAdmin = await Admin.findOneAndUpdate(
            { AdminID: req.params.id }, // Changed to AdminID
            req.body,
            { new: true }
        );
        if (!updatedAdmin) return res.status(404).json({ error: 'Admin not found' });
        res.json(updatedAdmin);
    } catch (err) {
        res.status(400).json({ error: 'Error updating admin', message: err.message });
    }
});

// Delete admin (DELETE /api/admins/:id)
router.delete('/:id', async (req, res) => {
    try {
        const deletedAdmin = await Admin.findOneAndDelete({ AdminID: req.params.id }); // Changed to AdminID
        if (!deletedAdmin) return res.status(404).json({ error: 'Admin not found' });
        res.json(deletedAdmin);
    } catch (err) {
        res.status(500).json({ error: 'Error deleting admin', message: err.message });
    }
});

export default router;
