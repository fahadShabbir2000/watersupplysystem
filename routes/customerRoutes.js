import express from 'express';
import Customer from '../models/customerSchema.js';
import bcrypt from 'bcrypt';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Create a customer (POST /api/customers)
router.post('/', async (req, res) => {
    try {
        // Find the last customer and increment the CustomerID
        const lastCustomer = await Customer.findOne().sort({ CustomerID: -1 }).exec();
        const newCustomerId = lastCustomer ? lastCustomer.CustomerID + 1 : 1; // Start with 1 if no customer exists

        // Extract the password from the request body & Check if the password is provided
        const { Password } = req.body;
        if (!Password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(Password, 10); // 10 is the salt rounds

        // Create the new customer with an incremented CustomerID
        const newCustomer = new Customer({ ...req.body, Password: hashedPassword, CustomerID: newCustomerId });

        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (err) {
        res.status(400).json({ error: 'Error creating customer', message: err.message });
    }
});

// Read all customers (GET /api/customers)
router.get('/', authorizeRoles('admin', 'super-admin'), async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching customers', message: err.message });
    }
});

// Read customer by ID (GET /api/customers/:id)
router.get('/:id', authorizeRoles('admin', 'super-admin', 'customer'), async (req, res) => {
    try {
        const customer = await Customer.findOne({ CustomerID: req.params.id });
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching customer', message: err.message });
    }
});

// Update customer (PUT /api/customers/:id)
router.put('/:id', authorizeRoles('admin', 'super-admin', 'customer'), async (req, res) => {
    try {
        const customer = await Customer.findOne({ CustomerID: req.params.id });
        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        // Update the customer's fields with the data from req.body
        Object.assign(customer, req.body);

        // Save the updated customer
        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ error: 'Error updating customer', message: err.message });
    }
});

// Delete customer (DELETE /api/customers/:id)
router.delete('/:id', authorizeRoles('super-admin'), async (req, res) => {
    try {
        const deletedCustomer = await Customer.findOneAndDelete({ CustomerID: req.params.id });
        if (!deletedCustomer) return res.status(404).json({ error: 'Customer not found' });
        res.json(deletedCustomer);
    } catch (err) {
        res.status(500).json({ error: 'Error deleting customer', message: err.message });
    }
});

export default router;
