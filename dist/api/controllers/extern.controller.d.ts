import { type Request, type Response } from 'express';
export declare const handleGetExternProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleGetExternPersonalDetails: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleGetExternOrganizationCredentials: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleGetExternBasicDetails: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleUpdateExternOrganizationCredentials: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const handleUpdateExternVerificationDocuments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleUpdateExternPhoto: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleUpdateExternEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleUpdateExternPhone: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleUpdateExternPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=extern.controller.d.ts.map