import * as authController from "../controllers/auth.controller.js";
import { Router } from 'express';
import { authLimiter } from "../../middleware/rateLimiter.js";
const authRoute = Router();
authRoute.post("/signin", authLimiter, authController.handleLogin);
authRoute.post("/signup", authLimiter, authController.handleSignup);
authRoute.post("/google", authLimiter, authController.handleGoogleAuth);
authRoute.post("/forgot-password", authLimiter, authController.handleForgotPassword);
authRoute.post("/reset-password", authLimiter, authController.handleResetPassword);
authRoute.get("/check-email", authController.handleCheckEmail);
export default authRoute;
//# sourceMappingURL=auth.routes.js.map