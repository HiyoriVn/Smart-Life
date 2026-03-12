const { models } = require("../../models");
const { Statistics } = models;

exports.getStatistics = async (userId) => {
  return Statistics.findOne({ where: { user_id: userId } });
};

exports.createStatistics = async (data) => {
  const { total_tasks, completed_tasks, study_time, user_id } = data;
  return Statistics.create({
    total_tasks,
    completed_tasks,
    study_time,
    user_id,
  });
};

exports.updateStatistics = async (id, data) => {
  const { total_tasks, completed_tasks, study_time } = data;
  const statistics = await Statistics.findOne({ where: { id } });
  if (!statistics) return null;
  statistics.total_tasks = total_tasks;
  statistics.completed_tasks = completed_tasks;
  statistics.study_time = study_time;
  await statistics.save();
  return statistics;
};

exports.deleteStatistics = async (id) => {
  const deleted = await Statistics.destroy({ where: { id } });
  return deleted > 0;
};
