const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// GET /api/courses — lấy danh sách môn học
router.get("/", courseController.getCourses);

// POST /api/courses — tạo môn học mới
router.post("/", courseController.createCourse);

module.exports = router;
