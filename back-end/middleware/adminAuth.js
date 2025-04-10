import jwt from "jsonwebtoken";

export const adminAuth = async (req, res, next) => {
    try {
        // ✅ Get token from "Authorization" header (not "token" header)
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ msg: "Not authorized" });
        }

        const token = authHeader.split(' ')[1]; // Extract token after "Bearer "

        // ✅ Verify token and check payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (
            decoded.email !== process.env.ADMIN_EMAIL.trim() || 
            decoded.role !== "admin"
        ) {
            return res.status(401).json({ msg: "Not authorized" });
        }

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Token expired, please log in again" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ msg: "Invalid token" });
        } else {
            return res.status(500).json({ msg: "Authentication failed" });
        }
    }
};