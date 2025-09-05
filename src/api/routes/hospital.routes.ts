import {Router} from "express";
import {authenticateToken} from "../../middleware/auth.middleware.js";
import * as hospitalController from "../controllers/hospital.controller.js";

const hospitalRoute = Router();

hospitalRoute.get("/profile",authenticateToken,hospitalController.handleGetHospitalProfile);
hospitalRoute.get("/profile/credentials",authenticateToken,hospitalController.handleGetHospitalProfileCredentials);
hospitalRoute.patch("/profile/credentials",authenticateToken,hospitalController.handleUpdateHospitalProfileCredentials);
hospitalRoute.patch("/profile/documents",authenticateToken,hospitalController.handleUpdateHospitalVerificationDocuments);
hospitalRoute.patch("/profile/photo",authenticateToken,hospitalController.handleUpdateHospitalPhoto);
hospitalRoute.patch("/profile/email",authenticateToken,hospitalController.handleUpdateHospitalEmail);
hospitalRoute.patch("/profile/phone",authenticateToken,hospitalController.handleUpdateHospitalPhone);
hospitalRoute.patch("/profile/password",authenticateToken,hospitalController.handleUpdateHospitalPassword);

export default hospitalRoute;