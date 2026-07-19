const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  toggleFeatured,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');

router.get('/my-properties', protect, getMyProperties);

router.route('/')
  .get(getProperties)
  .post(protect, createProperty);

router.route('/:id')
  .get(getProperty)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

router.put('/:id/featured', protect, toggleFeatured);

module.exports = router;
