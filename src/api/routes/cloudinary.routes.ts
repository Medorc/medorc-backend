// src/api/routes/cloudinary.routes.ts
import { Router } from 'express';
import multer from 'multer';
import * as cloudinaryController from '../controllers/cloudinary.controller.js';

const cloudinaryRoute = Router();

// Configure multer to temporarily store uploaded files
const upload = multer({ dest: 'uploads/' });

// Route for uploading a single photo
// The client must send the file in a form field named 'photo'
cloudinaryRoute.post(
    '/photo',
    upload.single('photo'),
    cloudinaryController.uploadImage
);

// Route for uploading a single document
// The client must send the file in a form field named 'doc'
cloudinaryRoute.post(
    '/doc',
    upload.single('doc'),
    cloudinaryController.uploadDocument
);

cloudinaryRoute.delete(
    '/asset',
    cloudinaryController.deleteAsset);

export default cloudinaryRoute;