// This tells TypeScript to merge the new file property with the existing Request interface from Express
declare namespace Express {
    export interface Request {
        file?: Multer.File; // or `file: Express.Multer.File | undefined`
    }
}