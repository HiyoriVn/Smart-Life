const { models } = require("../../models");
const { Course } = models;

exports.getCourses = async () => {
  return Course.findAll();
};

exports.getCourseById = async (id) => {
  return Course.findByPk(id);
};

exports.createCourse = async (data) => {
  const { name, description, user_id } = data;
  if (!name || !user_id) {
    const err = new Error("Thiếu thông tin bắt buộc: name, user_id");
    err.statusCode = 400;
    throw err;
  }
  return Course.create({ name, description, user_id });
};

exports.updateCourse = async (id, data) => {
  const course = await Course.findByPk(id);
  if (!course) return null;
  const { name, description } = data;
  if (name !== undefined) course.name = name;
  if (description !== undefined) course.description = description;
  await course.save();
  return course;
};

exports.deleteCourse = async (id) => {
  const course = await Course.findByPk(id);
  if (!course) return null;
  await course.destroy();
  return true;
};
