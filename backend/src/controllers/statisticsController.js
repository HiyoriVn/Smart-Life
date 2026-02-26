const { models } = require("../models");
const { Statistics } = models;

exports.getStatistics = async (req, res) => {
  try {
    const userId = req.params.userId;
    const statistics = await Statistics.findOne({ where: { user_id: userId } });

    if (!statistics) {
      return res.status(404).json({ message: "Statistics not found" });
    }

    res.status(200).json(statistics);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving statistics", error: error.message });
  }
};

exports.createStatistics = async (req, res) => {
  try {
    const { total_tasks, completed_tasks, study_time, user_id } = req.body;
    const newStatistics = await Statistics.create({
      total_tasks,
      completed_tasks,
      study_time,
      user_id,
    });

    res.status(201).json(newStatistics);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating statistics", error: error.message });
  }
};

exports.updateStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    const { total_tasks, completed_tasks, study_time } = req.body;

    const statistics = await Statistics.findOne({ where: { id } });

    if (!statistics) {
      return res.status(404).json({ message: "Statistics not found" });
    }

    statistics.total_tasks = total_tasks;
    statistics.completed_tasks = completed_tasks;
    statistics.study_time = study_time;

    await statistics.save();
    res.status(200).json(statistics);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating statistics", error: error.message });
  }
};

exports.deleteStatistics = async (req, res) => {
  try {
    const deleted = await Statistics.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Statistics not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting statistics", error: error.message });
  }
};
