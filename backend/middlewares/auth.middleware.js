const { verifyAccessToken } = require("../lib/token");


async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = verifyAccessToken(token);
        if (!decoded) {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function requireAdmin(req, res, next) {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { requireAuth, requireAdmin };
