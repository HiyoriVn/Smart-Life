const { models } = require("../models");
const { Course } = models;

// GET /api/courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res
      .status(200)
      .json({ message: "Lấy danh sách môn học thành công", data: courses });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách môn học",
        data: null,
        error: error.message,
      });
  }
};

// POST /api/courses
exports.createCourse = async (req, res) => {
  try {
    const { name, description, user_id } = req.body;
    if (!name || !user_id) {
      return res
        .status(400)
        .json({
          message: "Thiếu thông tin bắt buộc: name, user_id",
          data: null,
        });
    }
    const newCourse = await Course.create({ name, description, user_id });
    res
      .status(201)
      .json({ message: "Tạo môn học mới thành công", data: newCourse });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi tạo môn học",
        data: null,
        error: error.message,
      });
  }
};
