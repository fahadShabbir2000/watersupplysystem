import jwt from 'jsonwebtoken'; // Import JWT library for token verification
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Middleware to authenticate and authorize based on roles
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Check if the Authorization header is provided
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Authorization token is missing or invalid' });
            }

            // Extract the token from the Authorization header
            const token = authHeader.split(' ')[1];
            
            // Verify the token and extract the payload
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user information to the request object
            req.user = decoded;

            // Check if the user has one of the allowed roles
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Access denied. You do not have the required Resource Access.' });
            }
            next();
        } catch (err) {
            // Handle token verification error
            res.status(401).json({ error: 'Invalid or expired token', message: err.message });
        }
    };
};
