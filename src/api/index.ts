import express from "express";
import cloudinaryRoute from "./routes/cloudinary.routes.js"
import healthTipRoute from "./routes/health-tips.routes.js";
import authRoute from "./routes/auth.routes.js";
import patientRoute from "./routes/patient.routes.js";

const mainRouter = express.Router();


mainRouter.use("/cloudinary", cloudinaryRoute);
mainRouter.use("/health-tips", healthTipRoute);
mainRouter.use("/auth", authRoute);
mainRouter.use("/patient", patientRoute);

export default mainRouter;