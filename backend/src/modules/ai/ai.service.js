const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateSchedule = async ({ tasks, availableHours }) => {
  if (!tasks || tasks.length === 0) {
    const err = new Error("Không có task nào để xếp lịch!");
    err.statusCode = 400;
    throw err;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
            Bạn là một trợ lý ảo quản lý thời gian xuất sắc.
            Tôi có danh sách các công việc sau: ${JSON.stringify(tasks)}.
            Tôi có quỹ thời gian rảnh hôm nay là: ${availableHours} giờ.
            Hãy sắp xếp các công việc này vào lịch trình hợp lý nhất, ưu tiên các task có deadline gần và mức độ ưu tiên cao.
            TRẢ VỀ KẾT QUẢ DƯỚI DẠNG CHUẨN MẢNG JSON, KHÔNG KÈM THEO BẤT KỲ VĂN BẢN NÀO KHÁC.
            Mỗi object trong JSON có cấu trúc: { "taskName": "...", "startTime": "HH:MM", "endTime": "HH:MM" }
        `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const cleanJsonString = responseText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanJsonString);
};
