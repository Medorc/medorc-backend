// This tells TypeScript to merge the new file property with the existing Request interface from Express
import jwt from 'jsonwebtoken';
declare global {
    declare namespace Express {
        export interface Request {
            file?: Multer.File; // or `file: Express.Multer.File | undefined`
            user?: string | jwt.JwtPayload;
        }
    }
}