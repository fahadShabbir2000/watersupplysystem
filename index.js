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


// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Import Routes
import customerRoutes from './routes/customerRoutes.js';

// Use Routes
app.use('/api/customers', customerRoutes); // Define base path for customer routes

// Start the server
app.listen(PORT, () => {
    console.log(`Frontend is running on http://localhost:${PORT}`);
});
