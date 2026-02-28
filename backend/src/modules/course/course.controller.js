const courseService = require("./course.service");

// GET /api/courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await courseService.getCourses();
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
    const newCourse = await courseService.createCourse(req.body);
    res
      .status(201)
      .json({ message: "Tạo môn học mới thành công", data: newCourse });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message,
      data: null,
      error: error.message,
    });
  }
};

// GET /api/courses/:id
exports.getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course)
      return res
        .status(404)
        .json({ message: "Không tìm thấy môn học", data: null });
    res.status(200).json({ message: "Lấy môn học thành công", data: course });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy môn học",
      data: null,
      error: error.message,
    });
  }
};

// PUT /api/courses/:id
exports.updateCourse = async (req, res) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);
    if (!course)
      return res
        .status(404)
        .json({ message: "Không tìm thấy môn học", data: null });
    res
      .status(200)
      .json({ message: "Cập nhật môn học thành công", data: course });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật môn học",
      data: null,
      error: error.message,
    });
  }
};

// DELETE /api/courses/:id
exports.deleteCourse = async (req, res) => {
  try {
    const result = await courseService.deleteCourse(req.params.id);
    if (!result)
      return res
        .status(404)
        .json({ message: "Không tìm thấy môn học", data: null });
    res.status(200).json({ message: "Xóa môn học thành công", data: null });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa môn học",
      data: null,
      error: error.message,
    });
  }
};
