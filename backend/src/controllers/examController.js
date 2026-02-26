const { models } = require("../models");
const { Exam } = models;

exports.createExam = async (req, res) => {
  try {
    const { title, duration, type, exam_date, course_id, user_id } = req.body;
    const exam = await Exam.create({
      title,
      duration,
      type,
      exam_date,
      course_id,
      user_id,
    });
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: "Error creating exam", error });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.findAll();
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving exams", error });
  }
};

// alias for backward compatibility
exports.getExams = exports.getAllExams;

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
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
    const { title, duration, type, exam_date, course_id, user_id } = req.body;
    const [updated] = await Exam.update(
      { title, duration, type, exam_date, course_id, user_id },
      {
        where: { id: req.params.id },
      },
    );
    if (updated) {
      const updatedExam = await Exam.findByPk(req.params.id);
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
    const deleted = await Exam.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Exam not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting exam", error });
  }
};
