const express = require("express");
const router = express.Router();
const { verifyDev } = require("../middlewares/dev.middleware");
const { createAdmin } = require("../controllers/dev.controller");

router.post("/create-admin", verifyDev, createAdmin);


module.exports = router;