const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
  const user = req.user;

  // Include role in token payload here
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role || null },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
  });

  if (!user.role) {
    console.log('New user, redirecting to role selection');
    return res.redirect(`http://localhost:5173/choose-role?token=${token}`);
  }

  // Existing user - redirect based on role
  const redirectUrl =
    user.role === 'Admin'
      ? 'http://localhost:5173/admin-panel'
      : user.role === 'Vendor'
      ? 'http://localhost:5173/vendor-panel'
      : user.role === 'Chef'
      ? 'http://localhost:5173/chef-panel'
      : user.role === 'Delivery'
      ? 'http://localhost:5173/delivery-panel'
      : user.role === 'Customer'
      ? 'http://localhost:5173/customer-panel'
      : 'http://localhost:5173/';

  return res.redirect(redirectUrl);
});

// Save role after user selects it
router.post('/set-role', async (req, res) => {
  const { token, role } = req.body;

  if (!token || !role) return res.status(400).json({ message: 'Missing token or role' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    // Issue new token with role info
    const newToken = jwt.sign({ id: user._id, email: user.email, role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', newToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
    });

    // Redirect based on role
    const redirectUrl =
      role === 'Admin'
        ? 'http://localhost:5173/admin-panel'
        : role === 'Vendor'
        ? 'http://localhost:5173/vendor-panel'
        : role === 'Chef'
        ? 'http://localhost:5173/chef-panel'
        : role === 'Delivery'
        ? 'http://localhost:5173/delivery-panel'
        : role === 'Customer'
        ? 'http://localhost:5173/customer-panel'
        : 'http://localhost:5173/';

    res.json({ redirectUrl });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
