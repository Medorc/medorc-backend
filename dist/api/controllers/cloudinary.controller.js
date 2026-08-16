// src/api/controllers/cloudinary.controller.ts
import {} from 'express';
import * as cloudinaryService from '../../services/cloudinary.service.js';
import { strict } from "node:assert";
export const uploadImage = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const uploadDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No document file provided.' });
    }
    try {
        const result = await cloudinaryService.uploadFile(req.file.path, {
            folder: 'patient-documents',
            resource_type: 'auto',
        });
        res.status(200).json({
            message: 'Document uploaded successfully!',
            url: result.secure_url,
            public_id: result.public_id
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const VALID_RESOURCE_TYPES = ["image", "raw", "auto"];
function isValidResourceType(value) { return VALID_RESOURCE_TYPES.includes(value); }
export const deleteAsset = async (req, res) => {
    const { public_id, resource_type } = req.query;
    if (!public_id) {
        return res.status(400).json({ error: 'Public ID is required.' });
    }
    const resourceType = isValidResourceType(resource_type)
        ? resource_type
        : "auto";
    try {
        // After the 'if' block, TypeScript KNOWS `resource_type` is valid.
        // The error will be gone.
        await cloudinaryService.deleteFile(public_id, { resource_type: resourceType });
        res.status(200).json({ message: 'Asset deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//# sourceMappingURL=cloudinary.controller.js.map