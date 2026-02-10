import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: string | jwt.JwtPayload;
}
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) {
        // 401 Unauthorized: The client did not send a token.
        return res.status(401).json({ error: 'Authentication token required.' });
    }
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) {
            // 403 Forbidden: The token is invalid (e.g., expired, tampered).
            return res.status(403).json({ error: 'Token is not valid.' });
        }

        // 4. If valid, attach the payload to the request object
        if(user) req.user = user;
        // console.log(user);
        next();
    });

}