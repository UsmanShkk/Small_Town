const express = require('express');
const { register, login } = require('../controllers/authController');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router()

router.post('/register',register);
router.post('/login',login)
router.get('/me', protect, authController.getMe)
module.exports = router;