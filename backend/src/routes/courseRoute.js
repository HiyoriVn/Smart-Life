const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// GET    /api/courses       — Lấy danh sách môn học
router.get("/", courseController.getCourses);

// GET    /api/courses/:id   — Lấy chi tiết môn học
router.get("/:id", courseController.getCourseById);

// POST   /api/courses       — Tạo môn học mới
router.post("/", courseController.createCourse);

// PUT    /api/courses/:id   — Cập nhật môn học
router.put("/:id", courseController.updateCourse);

// DELETE /api/courses/:id   — Xóa môn học
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
