const { models } = require("../../models");
const { Exam } = models;

exports.createExam = async (data) => {
  const { title, duration, type, exam_date, course_id, user_id } = data;
  return Exam.create({ title, duration, type, exam_date, course_id, user_id });
};

exports.getAllExams = async () => {
  return Exam.findAll();
};

exports.getExamById = async (id) => {
  return Exam.findByPk(id);
};

exports.updateExam = async (id, data) => {
  const { title, duration, type, exam_date, course_id, user_id } = data;
  const [updated] = await Exam.update(
    { title, duration, type, exam_date, course_id, user_id },
    { where: { id } },
  );
  if (!updated) return null;
  return Exam.findByPk(id);
};

exports.deleteExam = async (id) => {
  const deleted = await Exam.destroy({ where: { id } });
  return deleted > 0;
};
