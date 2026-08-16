import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
interface AuthRequest extends Request {
    user?: string | jwt.JwtPayload;
}
export declare const authenticateToken: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=auth.middleware.d.ts.map