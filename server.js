import express from 'express';
import dotenv from 'dotenv';
import customerRoutes from './routes/customerRoutes.js';
import delieveryboyRoutes from './routes/deliveryBoyRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; 
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import dropDatabaseRouter from './routes/dropDatabaseRoutes.js';
import authorizationLogin from './routes/authorizationLogin.js';
import mongoose from 'mongoose';

dotenv.config(); // Load environment variables
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON requests
app.use(express.static('public')); // Serve static files from the 'public' directory

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Use the admin routes
app.use('/api/customers', customerRoutes);
app.use('/api/delieveryboy', delieveryboyRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/login', authorizationLogin);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/dropdatabase', dropDatabaseRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
