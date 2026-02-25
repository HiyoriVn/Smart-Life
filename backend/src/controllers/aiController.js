const { GoogleGenerativeAI } = require("@google/generative-ai");
// Khởi tạo Gemini với Key từ file .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSchedule = async (req, res) => {
  try {
    // Lấy danh sách các task do Frontend gửi lên
    const { tasks, availableHours } = req.body;

    if (!tasks || tasks.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có task nào để xếp lịch!" });
    }

    // 1. Gọi model Gemini (Dùng bản 1.5 flash cho nhanh)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. Viết câu lệnh (Prompt) ép AI làm chuyên gia xếp lịch
    const prompt = `
            Bạn là một trợ lý ảo quản lý thời gian xuất sắc.
            Tôi có danh sách các công việc sau: ${JSON.stringify(tasks)}.
            Tôi có quỹ thời gian rảnh hôm nay là: ${availableHours} giờ.
            Hãy sắp xếp các công việc này vào lịch trình hợp lý nhất, ưu tiên các task có deadline gần và mức độ ưu tiên cao.
            TRẢ VỀ KẾT QUẢ DƯỚI DẠNG CHUẨN MẢNG JSON, KHÔNG KÈM THEO BẤT KỲ VĂN BẢN NÀO KHÁC.
            Mỗi object trong JSON có cấu trúc: { "taskName": "...", "startTime": "HH:MM", "endTime": "HH:MM" }
        `;

    // 3. Bấm nút gửi cho AI
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 4. Xử lý đoạn text AI trả về thành chuỗi JSON thực thụ
    // (Mẹo làm sạch dữ liệu vì AI hay trả về kèm dấu ```json )
    const cleanJsonString = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const scheduleData = JSON.parse(cleanJsonString);

    // 5. Trả kết quả về cho Frontend
    res.status(200).json({
      message: "AI đã xếp lịch thành công!",
      data: scheduleData,
    });
  } catch (error) {
    console.error("Lỗi khi gọi AI:", error);
    res.status(500).json({
      message: "AI đang bận, vui lòng thử lại sau!",
      error: error.message,
    });
  }
};

module.exports = { generateSchedule };
