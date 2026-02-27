const Task = require("../models/task.model");
const User = require("../models/user.model");

const assignTask = async (req, res) => {
    try {
        const { title, description, status, assignedUser } = req.body;

        const user = await User.findOne({ username: assignedUser });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const task = await Task.create({ title, description, status, user: user._id });
        res.status(201).json({ message: "Task assigned successfully", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        // Ensure the task exists and belongs to the currently logged in user
        const task = await Task.findOne({ _id: taskId, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized to update" });
        }

        task.status = status || task.status;
        await task.save();

        res.json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllTasks = async (req, res) => {
    try {
        const { userId, status } = req.query;
        let query = {};

        // Admins can filter by userId, status, or both
        if (userId) query.user = userId;
        if (status) query.status = status;

        const tasks = await Task.find(query).populate("user", "username email role");
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { assignTask, updateTask, getMyTasks, getAllTasks };