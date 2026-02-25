const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");

// GET /api/schedules — lấy danh sách lịch học
router.get("/", scheduleController.getSchedules);

// POST /api/schedules — tạo lịch học thủ công
router.post("/", scheduleController.createSchedule);

module.exports = router;
