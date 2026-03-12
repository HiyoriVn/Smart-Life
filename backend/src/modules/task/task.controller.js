const taskService = require("./task.service");

// GET /api/tasks?status=...
exports.getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.query);
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
    const newTask = await taskService.createTask(req.body);
    res.status(201).json({ message: "Tạo task mới thành công", data: newTask });
  } catch (error) {
    const status = error.statusCode || 500;
    res
      .status(status)
      .json({ message: error.message, data: null, error: error.message });
  }
};

// PUT /api/tasks/:id/status  — dùng cho kéo thả Kanban
exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await taskService.updateTaskStatus(
      req.params.id,
      req.body.status,
    );
    if (!task) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy task", data: null });
    }
    res
      .status(200)
      .json({ message: "Cập nhật trạng thái task thành công", data: task });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message,
      data: null,
      error: error.message,
    });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy task", data: null });
    }
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
    const task = await taskService.getTaskById(req.params.id);
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
    const task = await taskService.updateTask(req.params.id, req.body);
    if (!task) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy task", data: null });
    }
    res.status(200).json({ message: "Cập nhật task thành công", data: task });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật task",
      data: null,
      error: error.message,
    });
  }
};
