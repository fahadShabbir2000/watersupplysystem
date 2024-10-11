import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000; // Use the PORT from .env or default to 3000

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true},
    uniqueId: { type: Number, default: uuidv4, unique: true } // Add uniqueId field
});

const User = mongoose.model('User', userSchema);

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create user (POST)
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    const lastUser = await User.findOne().sort({ uniqueId: -1 }).exec();
    const newUniqueId = lastUser ? lastUser.uniqueId + 1 : 1;
    const newUser = new User({ uniqueId: newUniqueId, name, email,  });

    try {
        console.log('Attempting to save user:', newUser);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

// Read all users (GET)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Read user by ID (GET)
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

// Update user (PUT)
app.put('/users/:id', async (req, res) => {
    const { name, email } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
        if (!updatedUser) return res.status(404).send('User not found');
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});

// Delete user (DELETE)
app.delete('/users/:id', async (req, res) => {
    try {
        console.log(req.params);
        console.log(req.params._id);
        const deletedUser = await User.findByIdAndDelete(req.params._id);
        if (!deletedUser) return res.status(404).send('User not found');
        res.json(deletedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
