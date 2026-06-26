const express = require('express');
const roadmapController = require('../controllers/roadmapController');

const router = express.Router();

router.get('/', roadmapController.fetchRoadmap);
router.post('/generate', roadmapController.streamRoadmap);
router.put('/task/:id', roadmapController.toggleTask);

module.exports = router;

