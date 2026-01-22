import { Router } from 'express';
import * as patientController from "../controllers/patient.controller.js"
import { authenticateToken } from "../../middleware/auth.middleware.js";
const patientRoute = Router();

patientRoute.get("/profile", authenticateToken, patientController.handleGetPatientProfile);
patientRoute.get("/profile/personal", authenticateToken, patientController.handleGetPatientPersonalDetails);
patientRoute.get("/profile/basic", authenticateToken, patientController.handleGetPatientBasicDetails);
patientRoute.get("/profile/emergency-contacts", authenticateToken, patientController.handleGetPatientEmergencyContacts);
patientRoute.get("/profile/data-logs", authenticateToken, patientController.handleGetPatientDataLogs);

patientRoute.patch("/profile/shc-visibility", authenticateToken, patientController.handleUpdatePatientVisibility);
patientRoute.patch("/profile/photo", authenticateToken, patientController.handleUpdatePatientPhoto);
patientRoute.patch("/profile/personal", authenticateToken, patientController.handleGetPatientBasicDetails);
patientRoute.patch("/profile/lifestyle", authenticateToken, patientController.handleUpdatePatientLifestyle);
patientRoute.patch("/profile/email", authenticateToken, patientController.handleUpdatePatientEmail);
patientRoute.patch("/profile/phone", authenticateToken, patientController.handleUpdatePatientPhoneNo);
patientRoute.patch("/profile/password", authenticateToken, patientController.handleUpdatePatientPassword);
patientRoute.post("/profile/emergency-contact", authenticateToken, patientController.handleAddPatientEmergencyContact);
patientRoute.delete("/profile/emergency-contact", authenticateToken, patientController.handleDeletePatientEmergencyContact);

patientRoute.post("/createrecord", authenticateToken, patientController.handleCreatePatientRecord);
patientRoute.post("/records/:record_id/hospitalization", authenticateToken, patientController.handleAddPatientHospitalizationDetails);
patientRoute.post("/records/:record_id/surgery", authenticateToken, patientController.handleAddPatientSurgeryDetails);
patientRoute.put("/records/:record_id/prescription", authenticateToken, patientController.handleAddPatientPrescription);
patientRoute.delete("/records/:record_id/prescription", authenticateToken, patientController.handleRemovePatientPrescription);
patientRoute.put("/records/:record_id/lab-results", authenticateToken, patientController.handleAddPatientLabResults);
patientRoute.delete("/records/:record_id/lab-results", authenticateToken, patientController.handleRemovePatientLabResults);
patientRoute.patch("/records/:record_id/visibility", authenticateToken, patientController.handleUpdatePatientRecordVisibility);

patientRoute.post("/records", authenticateToken, patientController.handleGetPatientRecords);
patientRoute.get("/records/:record_id/surgery", authenticateToken, patientController.handleGetPatientSurgeryDetails);
patientRoute.get("/records/:record_id/hospitalization", authenticateToken, patientController.handleGetPatientHospitalizationDetails);
patientRoute.get("/records/:record_id/documents", authenticateToken, patientController.handleGetPatientDocuments);


export default patientRoute;