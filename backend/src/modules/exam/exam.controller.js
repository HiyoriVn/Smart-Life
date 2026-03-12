const examService = require("./exam.service");

exports.createExam = async (req, res) => {
  try {
    const exam = await examService.createExam(req.body);
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: "Error creating exam", error });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const exams = await examService.getAllExams();
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving exams", error });
  }
};

// alias for backward compatibility
exports.getExams = exports.getAllExams;

exports.getExamById = async (req, res) => {
  try {
    const exam = await examService.getExamById(req.params.id);
    if (exam) {
      res.status(200).json(exam);
    } else {
      res.status(404).json({ message: "Exam not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving exam", error });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const updatedExam = await examService.updateExam(req.params.id, req.body);
    if (updatedExam) {
      res.status(200).json(updatedExam);
    } else {
      res.status(404).json({ message: "Exam not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating exam", error });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const deleted = await examService.deleteExam(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Exam not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting exam", error });
  }
};
