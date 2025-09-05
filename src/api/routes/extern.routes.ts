import {Router} from "express";
import {authenticateToken} from "../../middleware/auth.middleware.js";
import * as externController from "../controllers/extern.controller.js"

const externRoute = Router();

externRoute.get("/profile",authenticateToken,externController.handleGetExternProfile);
externRoute.get("/profile/personal",authenticateToken,externController.handleGetExternPersonalDetails);
externRoute.get("/profile/organization",authenticateToken,externController.handleGetExternOrganizationCredentials);
externRoute.get("/profile/basic",authenticateToken,externController.handleGetExternBasicDetails);

externRoute.patch("/profile/organization",authenticateToken,externController.handleUpdateExternOrganizationCredentials);
externRoute.patch("/profile/documents",authenticateToken,externController.handleUpdateExternVerificationDocuments);
externRoute.patch("/profile/photo",authenticateToken,externController.handleUpdateExternPhoto);
externRoute.patch("/profile/email",authenticateToken,externController.handleUpdateExternEmail);
externRoute.patch("/profile/phone",authenticateToken,externController.handleUpdateExternPhone);
externRoute.patch("/profile/password",authenticateToken,externController.handleUpdateExternPassword);

export default externRoute;