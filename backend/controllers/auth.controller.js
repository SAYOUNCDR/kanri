const User = require("../models/user.model");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../lib/token");
const bcrypt = require("bcrypt");


const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword, role: role || "user" });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const accessToken = generateAccessToken(user._id, user.role, user.tokenVersion, user.username, user.email);
        const refreshToken = generateRefreshToken(user._id, user.role);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "Refresh token not found" });
        }

        const decoded = verifyRefreshToken(token);
        if (!decoded) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const accessToken = generateAccessToken(user._id, user.role, user.tokenVersion, user.username, user.email);

        res.status(200).json({ accessToken });
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
}

const logoutUser = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });
    res.status(200).json({ message: "Logged out successfully" });
}

module.exports = { registerUser, loginUser, refreshToken, logoutUser };

