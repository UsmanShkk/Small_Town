// controllers/vendorController.js

const Vendor = require('../models/vendor');

// Get all vendors for admin
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update vendor approval status
exports.updateVendorStatus = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const { status } = req.body; // e.g., 'approved', 'rejected'

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { status },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Status updated', vendor });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
