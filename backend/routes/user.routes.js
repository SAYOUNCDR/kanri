const express = require("express");
const router = express.Router();
const { registerUser, loginUser, refreshToken, logoutUser, getAllUsers } = require("../controllers/auth.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");


router.post("/register-user", requireAuth, requireAdmin, registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);

router.get("/get-all-users", requireAuth, requireAdmin, getAllUsers);


module.exports = router;