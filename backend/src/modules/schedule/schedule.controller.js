const scheduleService = require("./schedule.service");

// GET /api/schedules
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await scheduleService.getSchedules();
    res
      .status(200)
      .json({ message: "Lấy danh sách lịch học thành công", data: schedules });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách lịch học",
      data: null,
      error: error.message,
    });
  }
};

// POST /api/schedules
exports.createSchedule = async (req, res) => {
  try {
    const newSchedule = await scheduleService.createSchedule(req.body);
    res
      .status(201)
      .json({ message: "Tạo lịch học thành công", data: newSchedule });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message,
      data: null,
      error: error.message,
    });
  }
};

// GET /api/schedules/:id
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await scheduleService.getScheduleById(req.params.id);
    if (!schedule)
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch học", data: null });
    res
      .status(200)
      .json({ message: "Lấy lịch học thành công", data: schedule });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy lịch học",
      data: null,
      error: error.message,
    });
  }
};

// PUT /api/schedules/:id
exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await scheduleService.updateSchedule(
      req.params.id,
      req.body,
    );
    if (!schedule)
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch học", data: null });
    res
      .status(200)
      .json({ message: "Cập nhật lịch học thành công", data: schedule });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật lịch học",
      data: null,
      error: error.message,
    });
  }
};

// DELETE /api/schedules/:id
exports.deleteSchedule = async (req, res) => {
  try {
    const result = await scheduleService.deleteSchedule(req.params.id);
    if (!result)
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch học", data: null });
    res.status(200).json({ message: "Xóa lịch học thành công", data: null });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa lịch học",
      data: null,
      error: error.message,
    });
  }
};
