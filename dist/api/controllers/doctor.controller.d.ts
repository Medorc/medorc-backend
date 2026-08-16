import { type Request, type Response } from 'express';
export declare const handleGetDoctorProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleGetDoctorProfileCredentials: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleGetDoctorBasicDetails: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const handleUpdateDoctorProfileCredentials: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const handleUpdateDoctorVerificationDocument: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const handleUpdateDoctorPhoto: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const handleUpdateDoctorEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const handleUpdateDoctorPhone: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const handleUpdateDoctorPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=doctor.controller.d.ts.map