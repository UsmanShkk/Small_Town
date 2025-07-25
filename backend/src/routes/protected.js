const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ msg: `Welcome, ${req.user.role}!`, user: req.user });
});

module.exports = router;
