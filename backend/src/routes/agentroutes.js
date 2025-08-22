const express = require('express');
const { getAvailableOrders, acceptOrder} = require('../controllers/agent');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware'); // checks JWT & user role

const router = express.Router();

// All routes require Delivery role
router.get('/orders/available', protect,authorizeRoles('Delivery'), getAvailableOrders);
router.put('/orders/:orderId/accept', protect, authorizeRoles('Delivery'),acceptOrder);
// router.put('agent/orders/:orderId/status', protect,authorizeRoles('Delivery'), updateOrderStatus);

module.exports = router;
