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
    res.status(500).json({
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
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc: name, user_id",
        data: null,
      });
    }
    const newCourse = await Course.create({ name, description, user_id });
    res
      .status(201)
      .json({ message: "Tạo môn học mới thành công", data: newCourse });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo môn học",
      data: null,
      error: error.message,
    });
  }
};

// GET /api/courses/:id
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course)
      return res
        .status(404)
        .json({ message: "Không tìm thấy môn học", data: null });
    res.status(200).json({ message: "Lấy môn học thành công", data: course });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy môn học",
        data: null,
        error: error.message,
      });
  }
};

// PUT /api/courses/:id
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course)
      return res
        .status(404)
        .json({ message: "Không tìm thấy môn học", data: null });
    const { name, description } = req.body;
    if (name !== undefined) course.name = name;
    if (description !== undefined) course.description = description;
    await course.save();
    res
      .status(200)
      .json({ message: "Cập nhật môn học thành công", data: course });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi cập nhật môn học",
        data: null,
        error: error.message,
      });
  }
};

// DELETE /api/courses/:id
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course)
      return res
        .status(404)
        .json({ message: "Không tìm thấy môn học", data: null });
    await course.destroy();
    res.status(200).json({ message: "Xóa môn học thành công", data: null });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi xóa môn học",
        data: null,
        error: error.message,
      });
  }
};
