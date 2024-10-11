import express from 'express';
import Order from '../models/OrderSchema.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Create an order
// router.post('/', async (req, res) => {
router.post('/', authorizeRoles('admin', 'super-admin', 'customer'), async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        if (err.code === 11000) {
            // Handle unique constraint violation
            const duplicateField = Object.keys(err.keyValue)[0]; // Get the duplicate field
            res.status(400).json({
                error: `Duplicate value found for field: ${duplicateField}`,
                message: err.message
            });
        } else {
            res.status(400).json({ error: 'Error creating order', message: err.message });
        }
    }
});

// Get all orders
router.get('/', authorizeRoles('admin', 'super-admin', 'customer', 'deliveryboy'), async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching orders', message: err.message });
    }
});

// Get order by ID
router.get('/order_id/:id', authorizeRoles('admin', 'super-admin', 'customer'), async (req, res) => {
    try {
        const order = await Order.findOne({ OrderID: req.params.id });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching order', message: err.message });
    }
});

// Get order by Customer ID
router.get('/customer_id/:id', authorizeRoles('admin', 'super-admin', 'customer'), async (req, res) => {
    try {
        const order = await Order.find({ CustomerID: req.params.id });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching order', message: err.message });
    }
});

// Get order by DeliveryBoy ID
router.get('/delivery_boy/:id', authorizeRoles('admin', 'super-admin', 'deliveryboy'), async (req, res) => {
    try {
        const order = await Order.find({ DeliveryBoyID: req.params.id });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching order', message: err.message });
    }
});

// Single API to update the order, handles both Admin/Super Admin and Delivery Boy
router.put('/:id', authorizeRoles('admin', 'super-admin', 'deliveryboy'), async (req, res) => {
    try {
        const order = await Order.findOne({ OrderID: req.params.id });
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Get the user's role from the middleware (attached to req.user)
        const { role } = req.user;

        // Define which fields can be updated by Delivery Boy
        const deliveryBoyAllowedUpdates = ['Status', 'EmptyBottlesReturned'];

        // Admins and Super Admins can update all fields
        if (role === 'admin' || role === 'superadmin') {
            // Admin or Super Admin can update all fields
            Object.assign(order, req.body);
        } else if (role === 'deliveryboy') {
            // Delivery Boy can only update Status and EmptyBottlesReturned
            const updates = req.body;
            const updateKeys = Object.keys(updates);
            const isValidUpdate = updateKeys.every((key) => deliveryBoyAllowedUpdates.includes(key));

            if (!isValidUpdate) {
                return res.status(400).json({ message: 'Unauthorized field update for Delivery Boy' });
            }

            // Perform the allowed updates for the Delivery Boy
            updateKeys.forEach((key) => {
                order[key] = updates[key];
            });
        }

        // Save the updated order
        const updatedOrder = await order.save();
        res.json(updatedOrder);

    } catch (err) {
        res.status(500).json({ error: 'Error updating order', message: err.message });
    }
});

// Delete order
router.delete('/:id', authorizeRoles('super-admin'), async (req, res) => {
    try {
        const deletedOrder = await Order.findOneAndDelete({ OrderID: req.params.id });
        if (!deletedOrder) return res.status(404).json({ error: 'Order not found' });
        res.json(deletedOrder);
    } catch (err) {
        res.status(500).json({ error: 'Error deleting order', message: err.message });
    }
});

export default router;