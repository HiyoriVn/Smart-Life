require("dotenv").config();
const { Sequelize } = require("sequelize");

// Khởi tạo kết nối Sequelize sử dụng thông tin từ file .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false, // Tắt log dài dòng trong terminal cho dễ nhìn
  },
);

module.exports = sequelize;
