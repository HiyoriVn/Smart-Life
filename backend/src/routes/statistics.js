const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

// Route to get statistics for a user
router.get('/:userId', statisticsController.getStatistics);

// Route to create statistics for a user
router.post('/', statisticsController.createStatistics);

// Route to update statistics for a user
router.put('/:id', statisticsController.updateStatistics);

// Route to delete statistics for a user
router.delete('/:id', statisticsController.deleteStatistics);

module.exports = router;