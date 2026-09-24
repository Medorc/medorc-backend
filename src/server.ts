// src/server.ts
import express from 'express';
import mainRouter from './api/index.js'; // Import the main router
import cors from "cors";

const app = express();
app.set('trust proxy', 1); // Trust reverse proxy on Render/Cloudflare
const port = process.env.PORT || 3000;

const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'https://medorc-frontend.vercel.app'
];

const allowedOrigins = process.env.CORS_ORIGIN 
    ? [...defaultOrigins, ...process.env.CORS_ORIGIN.split(',').map(o => o.trim())]
    : defaultOrigins;

const options: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy blocked access from origin: ${origin}`));
        }
    },
    credentials: true
};

app.use(cors(options));
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1', mainRouter);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled Application Error:', err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        error: err.message || 'Internal Server Error'
    });
});

if (!process.env.JWT_SECRET) {
    console.warn('⚠️ WARNING: JWT_SECRET environment variable is not defined.');
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});