const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { protectVendor } = require("../middlewares/vendormealmiddleware");
const { createOrder, getUserOrders, getVendorOrders,updateOrderStatus} = require("../controllers/orders");

const {
    registerVendor,
    loginVendor,
    getMeVendor,
  } = require('../controllers/vendorauth');

// Customer places an order
router.post("/orders", protect, authorizeRoles('Customer'), createOrder);

// Customer checks their orders
router.get("/order_check", protect, authorizeRoles('Customer'), getUserOrders);

// vendor
router.get('/vendor/orders', protectVendor, getVendorOrders);
// router.get('/vendor/stats', protectVendor, getVendorStats);
// router.get('/vendor/orders/:orderId', protectVendor, getVendorOrderById);
router.put('/vendor/orders/:orderId/status', protectVendor, updateOrderStatus);

module.exports = router;
