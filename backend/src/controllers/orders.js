const Order = require("../models/order");
const Vendor = require("../models/vendor");
const mongoose = require("mongoose");
const getCoordinatesFromAddress = require('../config/geocode');

// 1️⃣ Create new order
exports.createOrder = async (req, res) => {
  try {
    const { vendorId, items, deliveryAddress, paymentMethod } = req.body;
    const customerId = req.user._id;  // ✅ use _id since req.user is full User doc

    // Convert address to coordinates
    const location = await getCoordinatesFromAddress(deliveryAddress);
    if (!location) return res.status(400).json({ message: "Invalid delivery address" });

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let newOrder = new Order({
      customer: customerId,
      vendor: vendorId,
      items,
      totalAmount,
      deliveryAddress,
      deliveryLocation: location,
      paymentMethod: paymentMethod || "cod",
      status: "pending",
      statusHistory: [{ status: "pending", updatedAt: new Date() }]
    });

    await newOrder.save();

    // ✅ populate customer name + vendor name before emitting
    newOrder = await Order.findById(newOrder._id)
      .populate("customer", "name")
      .populate("vendor", "name");

    // Notify vendor in real-time via Socket.io
    const io = req.app.get("io");
    // backend
    io.to(`vendor_${vendorId}`).emit("newOrder", newOrder);


    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 2️⃣ Get user orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user.id })
            .populate("vendor items.meal");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3️⃣ Update order status (for vendor/delivery agent)

// orderController.js - Add these functions



// Helper function to calculate distance
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Helper function to calculate estimated delivery time
const calculateEstimatedDeliveryTime = (vendorLocation, customerLocation, status) => {
  if (!vendorLocation || !customerLocation) return null;
  
  const distance = getDistanceFromLatLonInKm(
    vendorLocation.coordinates[1], // lat
    vendorLocation.coordinates[0], // lon
    customerLocation.coordinates[1], // lat
    customerLocation.coordinates[0]  // lon
  );
  
  let estimatedMinutes = 0;
  
  switch (status) {
    case 'confirmed':
      estimatedMinutes = 30 + (distance * 3); // 30 min prep + 3 min per km
      break;
    case 'accepted':
    case 'preparing':
      estimatedMinutes = 20 + (distance * 3); // 20 min prep + delivery time from distance
      break;
    case 'out_for_delivery':
      estimatedMinutes = distance * 3; // Only calculate time from distance (3 min per km)
      break;
    default:
      estimatedMinutes = 30 + (distance * 3);
  }
  
  return new Date(Date.now() + estimatedMinutes * 60000);
};

// 1️⃣ Get all orders for vendor
exports.getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.vendor.id; // Changed from req.user.id to req.vendor.id
    const { status, page = 1, limit = 20 } = req.query;

    // Build filter
    const filter = { vendor: vendorId };
    if (status && status !== 'all') {
      // Handle comma-separated status values
      if (status.includes(',')) {
        const statusArray = status.split(',').map(s => s.trim());
        filter.status = { $in: statusArray };
      } else {
        filter.status = status;
      }
    }

    // Get orders
    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.meal', 'name price image')
      .populate('vendor', 'name location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Add distance calculation to each order
    const ordersWithDistance = orders.map(order => {
      let distance = null;
      if (order.vendor.location && order.deliveryLocation) {
        distance = getDistanceFromLatLonInKm(
          order.vendor.location.coordinates[1],
          order.vendor.location.coordinates[0],
          order.deliveryLocation.coordinates[1],
          order.deliveryLocation.coordinates[0]
        );
      }

      return {
        ...order.toObject(),
        distance: distance ? parseFloat(distance.toFixed(2)) : null
      };
    });

    // Get total count
    const totalOrders = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders: ordersWithDistance,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page < Math.ceil(totalOrders / limit),
        hasPrev: page > 1
      }
    });

  } catch (err) {
    console.error('Error fetching vendor orders:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};



// 3️⃣ Update order status (already exists, but here for completeness)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, preparationTime } = req.body;
    const vendorId = req.vendor.id; // Changed from req.user.id to req.vendor.id

    // Find order with vendor details
    const order = await Order.findOne({ _id: orderId, vendor: vendorId })
      .populate("vendor");

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    // Calculate estimated delivery time
    const vendorLocation = order.vendor.location;
    const customerLocation = order.deliveryLocation;
    let estimatedDeliveryTime = calculateEstimatedDeliveryTime(
      vendorLocation, 
      customerLocation, 
      status
    );

    // Custom preparation time override - only for confirmed status now
    if (preparationTime && status === 'confirmed') {
      const distance = getDistanceFromLatLonInKm(
        vendorLocation.coordinates[1],
        vendorLocation.coordinates[0],
        customerLocation.coordinates[1],
        customerLocation.coordinates[0]
      );
      estimatedDeliveryTime = new Date(Date.now() + (preparationTime + distance * 3) * 60000);
    }

    // Update order
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, vendor: vendorId },
      { 
        status,
        ...(estimatedDeliveryTime && { estimatedDeliveryTime }),
        $push: { 
          statusHistory: { 
            status, 
            updatedAt: new Date() 
          } 
        }
      },
      { new: true }
    ).populate("vendor items.meal customer");

    // Calculate distance for response
    const distance = getDistanceFromLatLonInKm(
      vendorLocation.coordinates[1],
      vendorLocation.coordinates[0],
      customerLocation.coordinates[1],
      customerLocation.coordinates[0]
    );

    // Emit real-time update to customer
    const io = req.app.get('io');
    io.to(`order_${orderId}`).emit('orderStatusUpdated', {
      ...updatedOrder.toObject(),
      distance: distance.toFixed(2)
    });

    res.json({ 
      success: true, 
      order: updatedOrder,
      distance: `${distance.toFixed(2)} km`,
      message: `Order status updated to ${status}`
    });

  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

