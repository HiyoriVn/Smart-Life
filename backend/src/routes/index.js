const express = require("express");
const router = express.Router();

// ── Core routes (Frontend) ────────────────────────────────────────────────────
router.use("/tasks", require("./taskRoute"));
router.use("/courses", require("./courseRoute"));
router.use("/schedules", require("./scheduleRoute"));
router.use("/ai", require("./aiRoute"));

// ── Extended routes ───────────────────────────────────────────────────────────
router.use("/users", require("./userRoute"));
router.use("/exams", require("./examRoute"));
router.use("/statistics", require("./statisticsRoute"));

module.exports = router;
