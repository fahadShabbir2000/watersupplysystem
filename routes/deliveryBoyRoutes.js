import express from 'express';
import DeliveryBoy from '../models/deliveryBoySchema.js';
import bcrypt from 'bcrypt';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Create a delivery boy (POST /api/delivery-boys)
router.post('/', authorizeRoles('admin', 'super-admin'), async (req, res) => {
    try {
        // Find the last delivery boy and increment the DeliveryBoyID
        const lastDeliveryBoy = await DeliveryBoy.findOne().sort({ DeliveryBoyID: -1 }).exec();
        const newDeliveryBoyId = lastDeliveryBoy ? lastDeliveryBoy.DeliveryBoyID + 1 : 1; // Start with 1 if no delivery boy exists

        // Extract the password from the request body & Check if the password is provided
        const { Password } = req.body;
        if (!Password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(Password, 10); // 10 is the salt rounds

        // Create the new delivery boy with an incremented DeliveryBoyID
        const newDeliveryBoy = new DeliveryBoy({ ...req.body, Password: hashedPassword, DeliveryBoyID: newDeliveryBoyId });
        
        const savedDeliveryBoy = await newDeliveryBoy.save();
        res.status(201).json(savedDeliveryBoy);
    } catch (err) {
        res.status(400).json({ error: 'Error creating delivery boy', message: err.message });
    }
});

// Get all delivery boys (GET /api/delivery-boys)
router.get('/', authorizeRoles('admin', 'super-admin'), async (req, res) => {
    try {
        const deliveryBoys = await DeliveryBoy.find();
        res.json(deliveryBoys);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching delivery boys', message: err.message });
    }
});

// Get delivery boy by ID (GET /api/delivery-boys/:id)
router.get('/:id', authorizeRoles('admin', 'super-admin'), async (req, res) => {
    try {
        const deliveryBoy = await DeliveryBoy.findOne({ DeliveryBoyID: req.params.id });
        if (!deliveryBoy) return res.status(404).json({ error: 'Delivery boy not found' });
        res.json(deliveryBoy);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching delivery boy', message: err.message });
    }
});

// Update delivery boy (PUT /api/delivery-boys/:id)
router.put('/:id', authorizeRoles('admin', 'super-admin'), async (req, res) => {
    try {
        const deliveryBoy = await DeliveryBoy.findOne({ DeliveryBoyID: req.params.id });
        if (!deliveryBoy) return res.status(404).json({ error: 'Delivery boy not found' });

        // Update the delivery boy's fields with the data from req.body
        Object.assign(deliveryBoy, req.body);

        // Save the updated delivery boy
        const updatedDeliveryBoy = await deliveryBoy.save();
        res.json(updatedDeliveryBoy);
    } catch (err) {
        res.status(400).json({ error: 'Error updating delivery boy', message: err.message });
    }
});

// Delete delivery boy (DELETE /api/delivery-boys/:id)
router.delete('/:id', authorizeRoles('super-admin'), async (req, res) => {
    try {
        const deletedDeliveryBoy = await DeliveryBoy.findOneAndDelete({ DeliveryBoyID: req.params.id });
        if (!deletedDeliveryBoy) return res.status(404).json({ error: 'Delivery boy not found' });
        res.json(deletedDeliveryBoy);
    } catch (err) {
        res.status(500).json({ error: 'Error deleting delivery boy', message: err.message });
    }
});

export default router;
