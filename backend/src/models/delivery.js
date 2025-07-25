// models/Delivery.js
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  deliveryAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming delivery agents are users with role 'deliveryAgent'
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'picked-up', 'in-transit', 'delivered', 'failed'],
    default: 'assigned'
  },
  pickupTime: Date,
  deliveryTime: Date,
  currentLocation: {
    lat: Number,
    lng: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Delivery = mongoose.model('Delivery', deliverySchema);
module.exports = Delivery;
