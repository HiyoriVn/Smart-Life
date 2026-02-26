// Re-export the already-initialized class-based models.
// Do NOT create a new Sequelize instance here — all models share the
// single instance from config/database.js (reads from .env).
const sequelize = require("../config/database");
const User = require("./User");
const Course = require("./Course");
const Task = require("./Task");
const Schedule = require("./Schedule");
const Exam = require("./Exam");
const Statistics = require("./Statistics");

const models = {
  User,
  Course,
  Task,
  Schedule,
  Exam,
  Statistics,
};

// Set up associations (runs once when this module is first loaded)
models.User.hasMany(models.Task, { foreignKey: "user_id" });
models.Task.belongsTo(models.User, { foreignKey: "user_id" });

models.User.hasMany(models.Course, { foreignKey: "user_id" });
models.Course.belongsTo(models.User, { foreignKey: "user_id" });

models.Course.hasMany(models.Task, { foreignKey: "course_id" });
models.Task.belongsTo(models.Course, { foreignKey: "course_id" });

models.Course.hasMany(models.Exam, { foreignKey: "course_id" });
models.Exam.belongsTo(models.Course, { foreignKey: "course_id" });

models.User.hasOne(models.Statistics, { foreignKey: "user_id" });
models.Statistics.belongsTo(models.User, { foreignKey: "user_id" });

models.User.hasMany(models.Schedule, { foreignKey: "user_id" });
models.Schedule.belongsTo(models.User, { foreignKey: "user_id" });

// Export models and the shared sequelize instance
module.exports = { sequelize, models };
