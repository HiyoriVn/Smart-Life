const express = require("express");
const router = express.Router();

// ── Core routes (Frontend) ────────────────────────────────────────────────────
router.use("/tasks", require("./task/task.route"));
router.use("/courses", require("./course/course.route"));
router.use("/schedules", require("./schedule/schedule.route"));
router.use("/ai", require("./ai/ai.route"));

// ── Extended routes ───────────────────────────────────────────────────────────
router.use("/users", require("./user/user.route"));
router.use("/exams", require("./exam/exam.route"));
router.use("/statistics", require("./statistics/statistics.route"));

module.exports = router;
