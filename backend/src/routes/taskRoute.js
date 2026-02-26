const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// GET  /api/tasks?status=...   — Lấy danh sách task (hỗ trợ lọc theo status cho Kanban)
router.get("/", taskController.getTasks);

// GET  /api/tasks/:id          — Lấy chi tiết một task
router.get("/:id", taskController.getTaskById);

// POST /api/tasks              — Tạo task mới
router.post("/", taskController.createTask);

// PUT  /api/tasks/:id          — Cập nhật toàn bộ thông tin task
router.put("/:id", taskController.updateTask);

// PUT  /api/tasks/:id/status   — Cập nhật trạng thái khi kéo thả Kanban
router.put("/:id/status", taskController.updateTaskStatus);

// DELETE /api/tasks/:id        — Xóa task
router.delete("/:id", taskController.deleteTask);

module.exports = router;
