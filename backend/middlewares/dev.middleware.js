const verifyDev = (req, res, next) => {
    try {
        const  devKey = req.headers["dev-key"];
        if (!devKey) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (devKey !== process.env.DEV_KEY) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { verifyDev };