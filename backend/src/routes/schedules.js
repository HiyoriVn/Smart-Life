const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Create a new schedule
router.post('/', scheduleController.createSchedule);

// Get all schedules
router.get('/', scheduleController.getAllSchedules);

// Get a schedule by ID
router.get('/:id', scheduleController.getScheduleById);

// Update a schedule by ID
router.put('/:id', scheduleController.updateSchedule);

// Delete a schedule by ID
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;