import {Router} from 'express';
import * as patientController from "../controllers/patient.controller.js"
import {authenticateToken} from "../../middleware/auth.middleware.js";
const patientRoute = Router();

patientRoute.get("/profile",authenticateToken,patientController.handleGetPatientProfile);
patientRoute.get("/profile/personal",authenticateToken,patientController.handleGetPatientPersonalDetails);
patientRoute.get("/profile/basic",authenticateToken,patientController.handleGetPatientBasicDetails);
patientRoute.get("/profile/emergency-contacts",authenticateToken,patientController.handleGetPatientEmergencyContacts);
patientRoute.get("/profile/data-logs",authenticateToken,patientController.handleGetPatientDataLogs);

patientRoute.patch("/profile/shc-visibility",authenticateToken,patientController.handleUpdatePatientVisibility);
patientRoute.patch("/profile/photo",authenticateToken,patientController.handleUpdatePatientPhoto);
patientRoute.patch("/profile/lifestyle",authenticateToken,patientController.handleUpdatePatientLifestyle);
patientRoute.patch("/profile/email",authenticateToken,patientController.handleUpdatePatientEmail);
patientRoute.patch("/profile/phone",authenticateToken,patientController.handleUpdatePatientPhoneNo);
patientRoute.patch("/profile/password",authenticateToken,patientController.handleUpdatePatientPassword);
patientRoute.post("/profile/emergency-contact",authenticateToken,patientController.handleAddPatientEmergencyContact);
patientRoute.delete("/profile/emergency-contact",authenticateToken,patientController.handleDeletePatientEmergencyContact);



export default patientRoute;