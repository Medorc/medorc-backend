import * as authController from "../controllers/auth.controller.js";
import { Router } from 'express';
import { authLimiter } from "../../middleware/rateLimiter.js";

const authRoute = Router();

authRoute.post("/signin", authLimiter, authController.handleLogin);
authRoute.post("/signup", authLimiter, authController.handleSignup);
authRoute.post("/google", authLimiter, authController.handleGoogleAuth);

export default authRoute;