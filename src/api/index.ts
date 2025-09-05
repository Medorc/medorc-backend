import express from "express";
import cloudinaryRoute from "./routes/cloudinary.routes.js"
import healthTipRoute from "./routes/health-tips.routes.js";
import authRoute from "./routes/auth.routes.js";
import patientRoute from "./routes/patient.routes.js";
import doctorRoute from "./routes/doctor.routes.js";
import hospitalRoute from "./routes/hospital.routes.js";
import externRoute from "./routes/extern.routes.js";

const mainRouter = express.Router();


mainRouter.use("/cloudinary", cloudinaryRoute);
mainRouter.use("/health-tips", healthTipRoute);
mainRouter.use("/auth", authRoute);
mainRouter.use("/patient", patientRoute);
mainRouter.use("/doctor", doctorRoute);
mainRouter.use("/hospital", hospitalRoute);
mainRouter.use("/extern", externRoute);

export default mainRouter;