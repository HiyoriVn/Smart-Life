require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/database");

// Load models + associations (side-effect import)
require("./models");

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log(
      "✅ Đã kết nối và tạo bảng trên Database PostgreSQL thành công!",
    );
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Lỗi không thể kết nối database:", err);
  });
