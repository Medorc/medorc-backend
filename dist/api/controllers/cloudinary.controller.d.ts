import { type Request, type Response } from 'express';
export declare const uploadImage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadDocument: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAsset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=cloudinary.controller.d.ts.map