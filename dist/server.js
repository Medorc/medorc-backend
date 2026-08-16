// src/server.ts
import express from 'express';
import mainRouter from './api/index.js'; // Import the main router
import cors from "cors";
const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'];
const options = {
    origin: (origin, callback) => {
        // Return the requesting origin to satisfy browser credentials: true policy
        callback(null, origin || true);
    },
    credentials: true
};
app.use(cors(options));
app.use(express.json());
app.use('/api/v1', mainRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=server.js.map