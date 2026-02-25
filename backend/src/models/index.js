const { Sequelize } = require('sequelize');
const User = require('./User');
const Course = require('./Course');
const Task = require('./Task');
const Schedule = require('./Schedule');
const Exam = require('./Exam');
const Statistics = require('./Statistics');

// Initialize Sequelize
const sequelize = new Sequelize('smartlife', 'root', 'rootpassword', {
  host: 'localhost',
  dialect: 'postgres',
});

// Define model relationships
const models = {
  User: User(sequelize),
  Course: Course(sequelize),
  Task: Task(sequelize),
  Schedule: Schedule(sequelize),
  Exam: Exam(sequelize),
  Statistics: Statistics(sequelize),
};

// Set up associations
models.User.hasMany(models.Task, { foreignKey: 'user_id' });
models.Task.belongsTo(models.User, { foreignKey: 'user_id' });

models.User.hasMany(models.Course, { foreignKey: 'user_id' });
models.Course.belongsTo(models.User, { foreignKey: 'user_id' });

models.Course.hasMany(models.Task, { foreignKey: 'course_id' });
models.Task.belongsTo(models.Course, { foreignKey: 'course_id' });

models.Course.hasMany(models.Exam, { foreignKey: 'course_id' });
models.Exam.belongsTo(models.Course, { foreignKey: 'course_id' });

models.User.hasOne(models.Statistics, { foreignKey: 'user_id' });
models.Statistics.belongsTo(models.User, { foreignKey: 'user_id' });

models.User.hasMany(models.Schedule, { foreignKey: 'user_id' });
models.Schedule.belongsTo(models.User, { foreignKey: 'user_id' });

// Export models and sequelize instance
module.exports = { sequelize, models };