import express from "express";
import cloudinaryRoute from "./routes/cloudinary.routes.js"

const mainRouter = express.Router();


mainRouter.use("/cloudinary", cloudinaryRoute);

export default mainRouter;