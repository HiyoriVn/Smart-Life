const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// GET /api/tasks?status=...  — lấy danh sách task, có thể lọc theo status (Kanban)
router.get("/", taskController.getTasks);

// POST /api/tasks — tạo task mới
router.post("/", taskController.createTask);

// PUT /api/tasks/:id/status — cập nhật trạng thái khi kéo thả Kanban
router.put("/:id/status", taskController.updateTaskStatus);

// DELETE /api/tasks/:id — xóa task
router.delete("/:id", taskController.deleteTask);

module.exports = router;
