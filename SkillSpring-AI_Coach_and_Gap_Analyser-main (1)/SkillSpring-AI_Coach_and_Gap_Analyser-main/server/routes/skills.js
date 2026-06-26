const express = require('express');
const multer = require('multer');
const skillController = require('../controllers/skillController');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', skillController.getSkills);
router.post('/', skillController.addSkill);
router.post('/parse-resume', upload.single('resume'), skillController.parseResume);
router.post('/import-github', skillController.importGithub);
router.put('/:id', skillController.editSkill);
router.delete('/:id', skillController.removeSkill);

module.exports = router;

