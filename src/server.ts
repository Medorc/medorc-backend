// src/server.ts
import express from 'express';
import mainRouter from './api/index.js'; // Import the main router

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api/v1', mainRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});