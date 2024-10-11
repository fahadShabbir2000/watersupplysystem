import express from 'express';
import mongoose from 'mongoose'; // Import mongoose

const router = express.Router();

// Endpoint to drop the entire database
router.delete('/', async (req, res) => {
    try {
        // Drop the entire database
        await mongoose.connection.db.dropDatabase();

        res.status(200).json({ message: 'Database dropped successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error dropping database', message: err.message });
    }
});

// Exporting the router as default
export default router;
