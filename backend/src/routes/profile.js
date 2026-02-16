const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const { profileValidator } = require('../utils/validators');

router.get('/', protect, getProfile);
router.put('/', protect, profileValidator, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;