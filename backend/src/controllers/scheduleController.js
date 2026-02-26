const { models } = require("../models");
const { Schedule } = models;

// GET /api/schedules
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      order: [["start_time", "ASC"]],
    });
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
    const { title, start_time, end_time, location, user_id } = req.body;
    if (!title || !start_time || !end_time || !user_id) {
      return res.status(400).json({
        message:
          "Thiếu thông tin bắt buộc: title, start_time, end_time, user_id",
        data: null,
      });
    }
    const newSchedule = await Schedule.create({
      title,
      start_time,
      end_time,
      location,
      user_id,
      is_auto: false,
    });
    res
      .status(201)
      .json({ message: "Tạo lịch học thành công", data: newSchedule });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo lịch học",
      data: null,
      error: error.message,
    });
  }
};

// GET /api/schedules/:id
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule)
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch học", data: null });
    res
      .status(200)
      .json({ message: "Lấy lịch học thành công", data: schedule });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy lịch học",
        data: null,
        error: error.message,
      });
  }
};

// PUT /api/schedules/:id
exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule)
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch học", data: null });
    const { title, start_time, end_time, location } = req.body;
    if (title !== undefined) schedule.title = title;
    if (start_time !== undefined) schedule.start_time = start_time;
    if (end_time !== undefined) schedule.end_time = end_time;
    if (location !== undefined) schedule.location = location;
    await schedule.save();
    res
      .status(200)
      .json({ message: "Cập nhật lịch học thành công", data: schedule });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi cập nhật lịch học",
        data: null,
        error: error.message,
      });
  }
};

// DELETE /api/schedules/:id
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule)
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch học", data: null });
    await schedule.destroy();
    res.status(200).json({ message: "Xóa lịch học thành công", data: null });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi xóa lịch học",
        data: null,
        error: error.message,
      });
  }
};
