import * as doctorController from "../controllers/doctor.controller.js";
import {Router} from "express";
import {authenticateToken} from "../../middleware/auth.middleware.js";

const doctorRoute = Router();

doctorRoute.get("/profile",authenticateToken,doctorController.handleGetDoctorProfile);
doctorRoute.get("/profile/credentials",authenticateToken,doctorController.handleGetDoctorProfileCredentials);
doctorRoute.get("/profile/basic",authenticateToken,doctorController.handleGetDoctorBasicDetails);

doctorRoute.patch("/profile/credentials",authenticateToken,doctorController.handleUpdateDoctorProfileCredentials);
doctorRoute.patch("/profile/documents",authenticateToken,doctorController.handleUpdateDoctorVerificationDocument);
doctorRoute.patch("/profile/photo",authenticateToken,doctorController.handleUpdateDoctorPhoto);
doctorRoute.patch("/profile/email",authenticateToken,doctorController.handleUpdateDoctorEmail);
doctorRoute.patch("/profile/phone",authenticateToken,doctorController.handleUpdateDoctorPhone);
doctorRoute.patch("/profile/password",authenticateToken,doctorController.handleUpdateDoctorPassword);

export default doctorRoute;