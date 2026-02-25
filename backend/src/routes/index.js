const express = require('express');
const router = express.Router();

const userRoutes = require('./users');
const courseRoutes = require('./courses');
const taskRoutes = require('./tasks');
const scheduleRoutes = require('./schedules');
const examRoutes = require('./exams');
const statisticsRoutes = require('./statistics');

router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/tasks', taskRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/exams', examRoutes);
router.use('/statistics', statisticsRoutes);

module.exports = router;