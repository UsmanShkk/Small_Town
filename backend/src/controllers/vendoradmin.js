const Vendor = require('../models/vendor');

// Get all pending vendors
exports.getPendingVendors = async (req, res) => {
  try {
    const pendingVendors = await Vendor.find({ status: 'pending' });
    res.status(200).json(pendingVendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pending vendors" });
  }
};

// Approve vendor
exports.approveVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.status = 'approved';
    await vendor.save();

    res.status(200).json({ message: "Vendor approved successfully", vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve vendor" });
  }
};

// Reject vendor
exports.rejectVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.status = 'rejected';
    await vendor.save();

    res.status(200).json({ message: "Vendor rejected successfully", vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reject vendor" });
  }
};
