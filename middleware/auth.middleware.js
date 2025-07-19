import jwt from 'jsonwebtoken'; // For JWT verification
// No need to import 'dotenv/config' here if it's already done in index.js
// as process.env variables are globally available after 'dotenv/config' runs once.

// Middleware to verify JWT token
export default function (req, res, next) {
    // Get token from header
    // The convention is to send the token in the 'x-auth-token' header
    const token = req.header('x-auth-token');

    // Check if no token is provided
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        // jwt.verify takes the token and your JWT_SECRET
        // If valid, it returns the decoded payload (the 'user' object you put in it during login/register)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user payload to the request object
        // This makes user.id and user.email available in subsequent route handlers (e.g., req.user.id)
        req.user = decoded.user;
        next(); // Call next middleware/route handler in the stack
    } catch (err) {
        // If verification fails (e.g., token is expired, tampered with, malformed)
        console.error('Token verification failed:', err.message);
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};