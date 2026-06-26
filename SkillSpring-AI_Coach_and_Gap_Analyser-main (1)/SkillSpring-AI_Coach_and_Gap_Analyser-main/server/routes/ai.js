const express = require('express');
const aiController = require('../controllers/aiController');

const router = express.Router();

router.post('/chat', aiController.streamChat);
router.post('/analyze-gaps', aiController.analyzeGaps);
router.get('/role-requirements/:role', aiController.getRoleRequirementsByRole);

module.exports = router;

