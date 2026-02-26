const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statisticsController");

// GET    /api/statistics/:userId  — Lấy thống kê theo user
router.get("/:userId", statisticsController.getStatistics);

// POST   /api/statistics          — Tạo bản ghi thống kê
router.post("/", statisticsController.createStatistics);

// PUT    /api/statistics/:id      — Cập nhật thống kê
router.put("/:id", statisticsController.updateStatistics);

// DELETE /api/statistics/:id      — Xóa thống kê
router.delete("/:id", statisticsController.deleteStatistics);

module.exports = router;
