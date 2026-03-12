const express = require("express");
const cors = require("cors");
const routes = require("./modules/routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

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

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
