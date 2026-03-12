const { models } = require("../../models");
const { Schedule } = models;

exports.getSchedules = async () => {
  return Schedule.findAll({ order: [["start_time", "ASC"]] });
};

exports.getScheduleById = async (id) => {
  return Schedule.findByPk(id);
};

exports.createSchedule = async (data) => {
  const { title, start_time, end_time, location, user_id } = data;
  if (!title || !start_time || !end_time || !user_id) {
    const err = new Error(
      "Thiếu thông tin bắt buộc: title, start_time, end_time, user_id",
    );
    err.statusCode = 400;
    throw err;
  }
  return Schedule.create({
    title,
    start_time,
    end_time,
    location,
    user_id,
    is_auto: false,
  });
};

exports.updateSchedule = async (id, data) => {
  const schedule = await Schedule.findByPk(id);
  if (!schedule) return null;
  const { title, start_time, end_time, location } = data;
  if (title !== undefined) schedule.title = title;
  if (start_time !== undefined) schedule.start_time = start_time;
  if (end_time !== undefined) schedule.end_time = end_time;
  if (location !== undefined) schedule.location = location;
  await schedule.save();
  return schedule;
};

exports.deleteSchedule = async (id) => {
  const schedule = await Schedule.findByPk(id);
  if (!schedule) return null;
  await schedule.destroy();
  return true;
};
