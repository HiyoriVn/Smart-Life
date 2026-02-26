require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./src/config/database");
const routes = require("./src/routes"); // ← single import, all routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount all API routes under /api
app.use("/api", routes);

// Health check
app.get("/", (req, res) => {
  res.send("Welcome to the Smart Life API - Server đang chạy rất mượt!");
});

// Kết nối DB
sequelize
  .sync({ alter: true }) // Thêm alter: true để tự động sửa bảng nếu DB thay đổi
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
