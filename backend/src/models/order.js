const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    items: [
      {
        meal: { type: mongoose.Schema.Types.ObjectId, ref: "Meal", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    deliveryLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lon, lat]
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'online'],
      default: 'cod'
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // ✅ use User, since delivery agents are users
      default: null,
    },
    
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
        },
        updatedAt: { type: Date, default: Date.now },
      }
    ],
    estimatedDeliveryTime: { type: Date },
  },
  { timestamps: true }
);


const Order = mongoose.model("Order", orderSchema);
module.exports = Order