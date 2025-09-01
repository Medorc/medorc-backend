import * as authController from "../controllers/auth.controller.js";
import { Router } from 'express';

const authRoute = Router();
authRoute.post("/signin",authController.signinUser);
authRoute.post("/signup",authController.signupUser);
export default authRoute;