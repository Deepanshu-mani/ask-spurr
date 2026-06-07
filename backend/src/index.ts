import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Allow multiple origins for development and production
const allowedOrigins = [
    'http://localhost:5173', // Local development
    'http://localhost:3000', // Alternative local port
    'https://ask-spurr.vercel.app', // Hardcoded fallback for Vercel
    process.env.FRONTEND_URL?.replace(/\/$/, ''), // Production frontend URL from env (strip trailing slash)
].filter(Boolean); // Remove undefined values

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin) return callback(null, true);

            // Strip trailing slash from incoming origin just in case
            const normalizedOrigin = origin.replace(/\/$/, '');

            if (allowedOrigins.includes(normalizedOrigin)) {
                callback(null, true);
            } else {
                console.error(`CORS blocked request from origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);
// Limit body size to prevent payload attacks / crashes
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/chat', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler (knows about AppError status codes)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

    // Self-ping every 14 minutes to prevent Render free-tier from sleeping
    // (Render sleeps instances after 15 minutes of inactivity)
    const SELF_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    setInterval(
        async () => {
            try {
                await fetch(`${SELF_URL}/health`);
                console.log('🏓 Self-ping sent to keep server alive');
            } catch {
                // Ignore – server is still starting or network blip
            }
        },
        14 * 60 * 1000
    ); // 14 minutes
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});

// Safety nets – prevent the process crashing on unexpected async errors
process.on('uncaughtException', (err) => {
    console.error('⚠️  Uncaught Exception (server kept alive):', err.message);
});

process.on('unhandledRejection', (reason) => {
    console.error('⚠️  Unhandled Promise Rejection (server kept alive):', reason);
});
