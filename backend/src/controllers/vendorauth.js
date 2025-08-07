const Vendor = require('../models/vendor');
const jwt = require('jsonwebtoken');

// Generate token
const createToken = (vendor) => {
  return jwt.sign(
    { id: vendor._id, role: 'vendor' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Register Vendor (after submitting request)
exports.registerVendor = async (req, res) => {
  const { name, email, password, address, foodType } = req.body;

  try {
    const exists = await Vendor.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const vendor = new Vendor({
      name,
      email,
      password,
      address,
      foodType,
      status: 'pending'
    });

    await vendor.save();
    const token = createToken(vendor);

// Send this token in a cookie to the frontend
    res.cookie('token', token, {
      httpOnly: true, // secure cookie, not accessible from JS
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // cookie expires in 1 day
    });

    // Respond with success message and status
    res.status(201).json({
      message: 'Vendor request submitted for approval',
      status: vendor.status  // will be 'pending'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering vendor' });
  }
};
  // inside registerVendor after await vendor.save();



// Login Vendor (only if approved)
exports.loginVendor = async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(400).json({ message: 'Invalid email or password' });

    if (vendor.status !== 'approved') {
      return res.status(403).json({ message: 'Vendor not approved yet' });
    }

    const isMatch = await vendor.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = createToken(vendor);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'Vendor login successful',
      vendor: {
        name: vendor.name,
        email: vendor.email,
        address: vendor.address,
        foodType: vendor.foodType,
        status: vendor.status,
      },
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Vendor Profile
// exports.getMeVendor = async (req, res) => {
//   try {
//     const vendor = await Vendor.findById(req.user.id).select('-password');

//     if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

//     res.json({
//       vendor: {
//         id: vendor._id,
//         name: vendor.name,
//         email: vendor.email,
//         address: vendor.address,
//         foodType: vendor.foodType,
//         status: vendor.status,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };
// Get Vendor Profile
exports.getMeVendor = async (req, res) => {
  try {
    const vendor = req.vendor; // use req.vendor set by protectVendor

    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    res.json({
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        address: vendor.address,
        foodType: vendor.foodType,
        status: vendor.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};




