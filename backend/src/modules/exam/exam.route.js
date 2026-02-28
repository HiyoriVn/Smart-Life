const express = require("express");
const router = express.Router();
const examController = require("./exam.controller");

// GET    /api/exams        — Lấy danh sách kỳ thi
router.get("/", examController.getAllExams);

// GET    /api/exams/:id    — Lấy chi tiết kỳ thi
router.get("/:id", examController.getExamById);

// POST   /api/exams        — Tạo kỳ thi mới
router.post("/", examController.createExam);

// PUT    /api/exams/:id    — Cập nhật kỳ thi
router.put("/:id", examController.updateExam);

// DELETE /api/exams/:id    — Xóa kỳ thi
router.delete("/:id", examController.deleteExam);

module.exports = router;
