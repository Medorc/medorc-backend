interface UploadOptions {
    folder: string;
    resource_type: 'image' | 'auto' | 'raw';
}
interface DeleteOptions {
    resource_type: 'image' | 'auto' | 'raw';
}
export declare const uploadFile: (localFilePath: string, options: UploadOptions) => Promise<import("cloudinary").UploadApiResponse>;
export declare const deleteFile: (publicId: string, options: DeleteOptions) => Promise<any>;
export {};
//# sourceMappingURL=cloudinary.service.d.ts.map