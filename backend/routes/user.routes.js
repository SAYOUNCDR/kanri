const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/auth.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");


router.post("/register-user", requireAuth, requireAdmin, registerUser);
router.post("/login", requireAuth, loginUser);


module.exports = router;