import {Router} from 'express';
import * as patientController from "../controllers/patient.controller.js"
import {authenticateToken} from "../../middleware/auth.middleware.js";
const patientRoute = Router();

patientRoute.get("/profile",authenticateToken,patientController.getProfile);
patientRoute.get("/profile/personal",authenticateToken,patientController.getPersonalDetails);
patientRoute.get("/profile/basic",authenticateToken,patientController.getBasicDetails);
patientRoute.get("/profile/emergency-contacts",authenticateToken,patientController.getEmergencyContacts);


export default patientRoute;