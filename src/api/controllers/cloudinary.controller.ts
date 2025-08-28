// src/api/controllers/cloudinary.controller.ts
import {type Request, type Response} from 'express';
import * as cloudinaryService from '../../services/cloudinary.service.js';

export const uploadImage = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided.' });
    }

    try {
        const result = await cloudinaryService.uploadFile(req.file.path, {
            folder: 'patient-photos',
            resource_type: 'image'
        });

        res.status(200).json({
            message: 'Image uploaded successfully!',
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const uploadDocument = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No document file provided.' });
    }

    try {
        const result = await cloudinaryService.uploadFile(req.file.path, {
            folder: 'patient-documents',
            resource_type: 'raw',
        });

        res.status(200).json({
            message: 'Document uploaded successfully!',
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};