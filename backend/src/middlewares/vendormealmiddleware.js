// src/middlewares/vendormealmiddleware.js
const jwt = require('jsonwebtoken');
const Vendor = require('../models/vendor');

// Protect Vendor Middleware
const protectVendor = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const vendor = await Vendor.findById(decoded.id).select('-password');
    if (!vendor) {
      return res.status(401).json({ message: 'Vendor not found' });
    }

    req.vendor = vendor;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};


const restrictToVendor = (req, res, next) => {
  if (!req.vendor) {
    return res.status(403).json({ message: 'Access denied: Not a vendor' });
  }
  next();
};

module.exports = { protectVendor, restrictToVendor };
