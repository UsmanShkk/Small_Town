const express = require('express');
const router = express.Router();
const {
  registerVendor,
  loginVendor,
  getMeVendor,
} = require('../controllers/vendorauth');
const { protectVendor }  = require("../middlewares/vendormealmiddleware")
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/register', registerVendor);
router.post('/login', loginVendor);
router.get('/me', protectVendor, getMeVendor);

module.exports = router;
