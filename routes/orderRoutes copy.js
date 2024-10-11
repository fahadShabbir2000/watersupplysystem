import express from 'express';
import Order from '../models/OrderSchema.js';

const router = express.Router();

// Create an order
router.post('/', async (req, res) => {
    try {
        // Find the last order and increment the OrderID
        // const lastOrder = await Order.findOne().sort({ OrderID: -1 }).exec();
        // const newOrderId = lastOrder ? lastOrder.OrderID + 1 : 1; // Start with 1 if no order exists

        // // Create the new order with an incremented OrderID
        // const newOrder = new Order({ OrderID: newOrderId, ...req.body });
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
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching orders', message: err.message });
    }
});

// Get order by ID
router.get('/order_id/:id', async (req, res) => {
    try {
        const order = await Order.findOne({ OrderID: req.params.id });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching order', message: err.message });
    }
});

// Get order by Customer ID
router.get('/customer_id/:id', async (req, res) => {
    try {
        const order = await Order.find({ CustomerID: req.params.id });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching order', message: err.message });
    }
});

// Get order by DeliveryBoy ID
router.get('/delivery_boy/:id', async (req, res) => {
    try {
        const order = await Order.find({ DeliveryBoyID: req.params.id });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching order', message: err.message });
    }
});

// Update order
router.put('/:id', async (req, res) => {
    try {
        const order = await Order.findOne({ OrderID: req.params.id });
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Update the order's fields with the data from req.body
        Object.assign(order, req.body);

        // Save the updated order
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ error: 'Error updating order', message: err.message });
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findOneAndDelete({ OrderID: req.params.id });
        if (!deletedOrder) return res.status(404).json({ error: 'Order not found' });
        res.json(deletedOrder);
    } catch (err) {
        res.status(500).json({ error: 'Error deleting order', message: err.message });
    }
});

export default router;