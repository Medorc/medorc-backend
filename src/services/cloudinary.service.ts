import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// Define the options for the upload
interface UploadOptions {
    folder: string;
    resource_type: 'image' | 'auto' | 'raw'; // Can be 'image', 'video', or 'raw' for documents
}

export const uploadFile = async (localFilePath: string, options: UploadOptions) => {
    try {
        const result = await cloudinary.uploader.upload(localFilePath, {
            folder: options.folder,
            resource_type: options.resource_type,
        });

        // Delete the temporary file after a successful upload
        fs.unlinkSync(localFilePath);

        return result;
    } catch (error) {
        // In case of an upload error, still try to delete the temporary file
        fs.unlinkSync(localFilePath);
        console.error("Cloudinary upload failed:", error);
        throw new Error("Failed to upload file to Cloudinary.");
    }
};