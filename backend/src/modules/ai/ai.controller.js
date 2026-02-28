const aiService = require("./ai.service");

const generateSchedule = async (req, res) => {
  try {
    const scheduleData = await aiService.generateSchedule(req.body);
    res.status(200).json({
      message: "AI đã xếp lịch thành công!",
      data: scheduleData,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    console.error("Lỗi khi gọi AI:", error);
    res.status(status).json({
      message:
        status === 400 ? error.message : "AI đang bận, vui lòng thử lại sau!",
      error: error.message,
    });
  }
};

module.exports = { generateSchedule };
