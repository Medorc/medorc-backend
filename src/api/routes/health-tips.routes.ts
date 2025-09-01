import { Router } from 'express';
import {randomHealthTip} from "../controllers/health-tips.controller.js";

const healthTipRoute = Router();

healthTipRoute.get("/random",randomHealthTip);

export default healthTipRoute;