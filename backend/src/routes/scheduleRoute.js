const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");

// GET    /api/schedules       — Lấy danh sách lịch học (sắp xếp theo thời gian)
router.get("/", scheduleController.getSchedules);

// GET    /api/schedules/:id   — Lấy chi tiết lịch học
router.get("/:id", scheduleController.getScheduleById);

// POST   /api/schedules       — Tạo lịch học thủ công
router.post("/", scheduleController.createSchedule);

// PUT    /api/schedules/:id   — Cập nhật lịch học
router.put("/:id", scheduleController.updateSchedule);

// DELETE /api/schedules/:id   — Xóa lịch học
router.delete("/:id", scheduleController.deleteSchedule);

module.exports = router;
