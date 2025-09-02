import {Router} from 'express';
import * as patientController from "../controllers/patient.controller.js"
import {authenticateToken} from "../../middleware/auth.middleware.js";
const patientRoute = Router();

patientRoute.get("/profile",authenticateToken,patientController.getProfile);
patientRoute.get("/profile/personal",authenticateToken,patientController.getPersonalDetails);
patientRoute.get("/profile/basic",authenticateToken,patientController.getBasicDetails);
patientRoute.get("/profile/emergency-contacts",authenticateToken,patientController.getEmergencyContacts);
patientRoute.get("/profile/data-logs",authenticateToken,patientController.getDataLogs);

patientRoute.patch("/profile/shc-visibility",authenticateToken,patientController.togglepatientVisibility);
patientRoute.patch("/profile/photo",authenticateToken,patientController.updatePatientPhoto);
patientRoute.patch("/profile/lifestyle",authenticateToken,patientController.updatePatientLifestyle);
patientRoute.patch("/profile/email",authenticateToken,patientController.updatePatientEmail);
patientRoute.patch("/profile/phone",authenticateToken,patientController.updatePatientPhoneNo);
patientRoute.patch("/profile/password",authenticateToken,patientController.updatePatientPassword);
patientRoute.post("/profile/emergency-contact",authenticateToken,patientController.addPatientEmergencyContact);
patientRoute.delete("/profile/emergency-contact",authenticateToken,patientController.deletePatientEmergencyContact);


export default patientRoute;