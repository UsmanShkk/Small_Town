const express = require('express');
const router = express.Router();

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const userController = require('../controllers/usercontroller');

// GET all users (Admin only)
router.get('/', protect, authorizeRoles('Admin'), userController.getall);

// GET specific user by ID (Admin only)
router.get('/:id', protect, authorizeRoles('Admin'), userController.getbyid);

// POST: Create a new user (Admin only)
router.post('/', protect, authorizeRoles('Admin'), userController.createuser);

// PUT: Update existing user by ID (Admin only)
router.put('/:id', protect, authorizeRoles('Admin'), userController.update);
router.delete('/:id', protect, authorizeRoles('Admin'), userController.deleteUser);
// DELETE: Optional - delete a user by ID
// router.delete('/:id', protect, authorizeRoles('Admin'), userController.deleteUser);

module.exports = router;
