const express = require('express');
const router = express.Router();
const {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  generatePDF,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getResumes).post(createResume);
router.route('/:id').get(getResume).put(updateResume).delete(deleteResume);
router.get('/:id/pdf', generatePDF);

module.exports = router;
