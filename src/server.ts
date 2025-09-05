// src/server.ts
import express from 'express';
import mainRouter from './api/index.js'; // Import the main router
import cors from "cors";

const app = express();
const port = 3000;

const allowedOrigins = ['http://localhost:5173'];
const options: cors.CorsOptions = {
    origin: allowedOrigins
};

app.use(cors(options));
app.use(express.json());

app.use('/api/v1', mainRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});