import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 authentication requests per 15-minute window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many login attempts from this IP address. Please try again after 15 minutes for healthcare security."
    }
});
