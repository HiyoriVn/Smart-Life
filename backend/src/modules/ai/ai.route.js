const express = require("express");
const router = express.Router();
const { generateSchedule } = require("./ai.controller");

// Tạo đường dẫn API: POST /api/ai/auto-schedule
router.post("/auto-schedule", generateSchedule);

module.exports = router;
