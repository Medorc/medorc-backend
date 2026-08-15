import { Router } from 'express';
import { handleOrbyChat, handleWebhook } from '../controllers/orby.controller.js';

const orbyRoute = Router();

orbyRoute.post('/chat', handleOrbyChat);
orbyRoute.post('/webhook', handleWebhook);

export default orbyRoute;
