import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/adminSchema.js';
import DeliveryBoy from '../models/deliveryBoySchema.js';
import Customer from '../models/customerSchema.js';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

// Unified login route
router.post('/', async (req, res) => {
    const { Email, Password } = req.body; // Assuming email and password are provided

    // Check if both email and password are provided
    if (!Email && !Password) {
        return res.status(400).json({ error: 'Email and Password are required' });
    }
    else if (!Email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    else if (!Password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    try {
        // Check if the user is an Admin
        let user = await Admin.findOne({ Email: Email });
        if (user) {
            const match = await bcrypt.compare(Password, user.Password); // Assuming Password is hashed
            if (match) {
                const token = jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_SECRET, {
                    expiresIn: '1h',
                });
                return res.json({ token }); // Return token for admin
            }
        }

        // Check if the user is a Delivery Boy
        user = await DeliveryBoy.findOne({ Email: Email });
        if (user) {
            const match = await bcrypt.compare(Password, user.Password);
            if (match) {
                const token = jwt.sign({ id: user._id, role: 'deliveryboy' }, process.env.JWT_SECRET, {
                    expiresIn: '1h',
                });
                return res.json({ token }); // Return token for delivery boy
            }
        }

        // Check if the user is a Customer
        user = await Customer.findOne({ Email: Email });
        if (user) {
            const match = await bcrypt.compare(Password, user.Password);
            if (match) {
                const token = jwt.sign({ id: user._id, role: 'customer' }, process.env.JWT_SECRET, {
                    expiresIn: '1h',
                });
                return res.json({ token }); // Return token for customer
            }
        }

        return res.status(401).json({ error: 'Invalid email or password' }); // User not found
    } catch (err) {
        return res.status(500).json({ error: 'Error logging in', message: err.message });
    }
});

export default router;
