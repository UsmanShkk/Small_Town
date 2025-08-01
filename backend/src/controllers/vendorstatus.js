// routes/vendorRoutes.js
const express = require('express');
const router = express.Router();
const Vendor = require('../models/vendor');
const { protect } = require('../middlewares/vendormiddleware');

// Get logged-in vendor's status
router.get('/vendor/status', protect, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id).select('status');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({ status: vendor.status });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
