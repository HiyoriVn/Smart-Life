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
    res
      .status(500)
      .json({
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
      is_auto: false, // lịch tạo thủ công
    });
    res
      .status(201)
      .json({ message: "Tạo lịch học thành công", data: newSchedule });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi tạo lịch học",
        data: null,
        error: error.message,
      });
  }
};
