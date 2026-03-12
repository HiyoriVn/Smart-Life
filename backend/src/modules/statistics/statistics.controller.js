const statisticsService = require("./statistics.service");

exports.getStatistics = async (req, res) => {
  try {
    const statistics = await statisticsService.getStatistics(req.params.userId);
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
    const newStatistics = await statisticsService.createStatistics(req.body);
    res.status(201).json(newStatistics);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating statistics", error: error.message });
  }
};

exports.updateStatistics = async (req, res) => {
  try {
    const statistics = await statisticsService.updateStatistics(
      req.params.id,
      req.body,
    );
    if (!statistics) {
      return res.status(404).json({ message: "Statistics not found" });
    }
    res.status(200).json(statistics);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating statistics", error: error.message });
  }
};

exports.deleteStatistics = async (req, res) => {
  try {
    const deleted = await statisticsService.deleteStatistics(req.params.id);
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
