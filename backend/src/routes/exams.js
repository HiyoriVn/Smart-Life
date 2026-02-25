const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

// Route to create a new exam
router.post('/', examController.createExam);

// Route to retrieve all exams
router.get('/', examController.getAllExams);

// Route to retrieve a specific exam by ID
router.get('/:id', examController.getExamById);

// Route to update an exam by ID
router.put('/:id', examController.updateExam);

// Route to delete an exam by ID
router.delete('/:id', examController.deleteExam);

module.exports = router;