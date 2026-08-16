import { type Request, type Response } from "express";
export declare const handleLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleGoogleAuth: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const handleCheckEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const handleForgotPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const handleResetPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const handleSignup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.controller.d.ts.map