const { models } = require("../../models");
const { Task } = models;
const { Op } = require("sequelize");

exports.getTasks = async ({ status } = {}) => {
  const where = {};
  if (status) {
    const statusList = status.split(",").map((s) => s.trim());
    where.status =
      statusList.length > 1 ? { [Op.in]: statusList } : statusList[0];
  }
  return Task.findAll({ where, order: [["created_at", "ASC"]] });
};

exports.getTaskById = async (id) => {
  return Task.findByPk(id);
};

exports.createTask = async (data) => {
  const { title, description, deadline, priority, status, course_id, user_id } =
    data;
  if (!title || !deadline || !priority || !status || !user_id) {
    const err = new Error(
      "Thiếu thông tin bắt buộc: title, deadline, priority, status, user_id",
    );
    err.statusCode = 400;
    throw err;
  }
  return Task.create({
    title,
    description,
    deadline,
    priority,
    status,
    course_id,
    user_id,
  });
};

exports.updateTaskStatus = async (id, status) => {
  if (!status) {
    const err = new Error("Thiếu trường status");
    err.statusCode = 400;
    throw err;
  }
  const task = await Task.findByPk(id);
  if (!task) return null;
  task.status = status;
  await task.save();
  return task;
};

exports.updateTask = async (id, data) => {
  const task = await Task.findByPk(id);
  if (!task) return null;
  const { title, description, deadline, priority, status, course_id } = data;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (deadline !== undefined) task.deadline = deadline;
  if (priority !== undefined) task.priority = priority;
  if (status !== undefined) task.status = status;
  if (course_id !== undefined) task.course_id = course_id;
  await task.save();
  return task;
};

exports.deleteTask = async (id) => {
  const task = await Task.findByPk(id);
  if (!task) return null;
  await task.destroy();
  return true;
};
