import * as authController from "../controllers/auth.controller.js";
import { Router } from 'express';

const authRoute = Router();
authRoute.post("/signin",authController.handleLogin);
authRoute.post("/signup",authController.handleSignup);
export default authRoute;