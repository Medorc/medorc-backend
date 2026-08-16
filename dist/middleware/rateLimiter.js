import rateLimit from "express-rate-limit";
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 authentication requests per 15-minute window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many requests from this IP address. Please try again after 15 minutes."
    }
});
//# sourceMappingURL=rateLimiter.js.map