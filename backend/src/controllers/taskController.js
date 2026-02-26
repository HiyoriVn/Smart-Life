const { models } = require("../models");
const { Task } = models;
const { Op } = require("sequelize");

// GET /api/tasks?status=...
exports.getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) {
      // Hỗ trợ lọc nhiều status: ?status=todo,in_progress
      const statusList = status.split(",").map((s) => s.trim());
      where.status =
        statusList.length > 1 ? { [Op.in]: statusList } : statusList[0];
    }
    const tasks = await Task.findAll({ where, order: [["created_at", "ASC"]] });
    res
      .status(200)
      .json({ message: "Lấy danh sách task thành công", data: tasks });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách task",
      data: null,
      error: error.message,
    });
  }
};

// POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      deadline,
      priority,
      status,
      course_id,
      user_id,
    } = req.body;
    if (!title || !deadline || !priority || !status || !user_id) {
      return res.status(400).json({
        message:
          "Thiếu thông tin bắt buộc: title, deadline, priority, status, user_id",
        data: null,
      });
    }
    const newTask = await Task.create({
      title,
      description,
      deadline,
      priority,
      status,
      course_id,
      user_id,
    });
    res.status(201).json({ message: "Tạo task mới thành công", data: newTask });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo task", data: null, error: error.message });
  }
};

// PUT /api/tasks/:id/status  — dùng cho kéo thả Kanban
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res
        .status(400)
        .json({ message: "Thiếu trường status", data: null });
    }
    const task = await Task.findByPk(id);
    if (!task) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy task", data: null });
    }
    task.status = status;
    await task.save();
    res
      .status(200)
      .json({ message: "Cập nhật trạng thái task thành công", data: task });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật trạng thái task",
      data: null,
      error: error.message,
    });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy task", data: null });
    }
    await task.destroy();
    res.status(200).json({ message: "Xóa task thành công", data: null });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa task", data: null, error: error.message });
  }
};

// GET /api/tasks/:id
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy task", data: null });
    }
    res.status(200).json({ message: "Lấy task thành công", data: task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy task", data: null, error: error.message });
  }
};

// PUT /api/tasks/:id  — cập nhật toàn bộ thông tin task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, priority, status, course_id } =
      req.body;
    const task = await Task.findByPk(id);
    if (!task) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy task", data: null });
    }
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (deadline !== undefined) task.deadline = deadline;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (course_id !== undefined) task.course_id = course_id;
    await task.save();
    res.status(200).json({ message: "Cập nhật task thành công", data: task });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi cập nhật task",
        data: null,
        error: error.message,
      });
  }
};
