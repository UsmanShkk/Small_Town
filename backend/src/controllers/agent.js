const Order = require('../models/order');
const User = require('../models/user');
// Get available orders
const getAvailableOrders = async (req, res) => {
  try {
    console.log("Assigned Agent:", req.user);
    const orders = await Order.find({ status: 'preparing' })
      .populate('customer', 'name email')
      .populate('vendor', 'name address');

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Agent accepts order → moves to "out_for_delivery"
// Agent accepts order → just notify vendor, don't update status
// controllers/agentController.js


const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const agentId = req.user._id;
   
    let order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Assign the delivery agent
    order.deliveryAgent = agentId;
    await order.save();

    // ✅ Re-fetch with population so .name exists
    order = await Order.findById(orderId)
      .populate("customer", "name")
      .populate("vendor", "name")
      .populate("deliveryAgent", "name email role");  // add fields

    const io = req.app.get("io");

    io.to(`vendor_${order.vendor._id}`).emit("agentAcceptedOrder", {
      orderId: order._id,
      agentName: order.deliveryAgent?.name || order.deliveryAgent?.email || "Unknown Agent"
    });
    

    res.json({ message: "Order assigned to agent", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = { getAvailableOrders, acceptOrder};