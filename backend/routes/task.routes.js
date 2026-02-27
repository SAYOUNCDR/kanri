const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");
const { assignTask, updateTask, getMyTasks, getAllTasks } = require("../controllers/task.controller");

// Admin routes
router.post("/assign-task", requireAuth, requireAdmin, assignTask);
router.get("/all", requireAuth, requireAdmin, getAllTasks);

// User/Shared routes
router.patch("/:taskId", requireAuth, updateTask);
router.get("/my-tasks", requireAuth, getMyTasks);

module.exports = router;