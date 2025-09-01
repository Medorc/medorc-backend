import express from "express";
import cloudinaryRoute from "./routes/cloudinary.routes.js"
import healthTipRoute from "./routes/health-tips.routes.js";
import authRoute from "./routes/auth.routes.js";

const mainRouter = express.Router();


mainRouter.use("/cloudinary", cloudinaryRoute);
mainRouter.use("/health-tips", healthTipRoute);
mainRouter.use("/auth", authRoute);

export default mainRouter;