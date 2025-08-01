const express = require('express');
const router = express.Router();

const {
  getPendingVendors,
  approveVendor,
  rejectVendor
} = require('../controllers/vendoradmin');

const { protect , restrictToAdmin} = require('../middlewares/vendormiddleware')

// All admin-only routes
router.get('/vendors/pending', protect, restrictToAdmin, getPendingVendors);
router.put('/vendors/:id/approve', protect, restrictToAdmin, approveVendor);
router.put('/vendors/:id/reject', protect, restrictToAdmin, rejectVendor);

module.exports = router;
