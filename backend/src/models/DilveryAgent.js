// models/DeliveryAgent.js
const mongoose = require('mongoose');

const deliveryAgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // in case some agents don’t have email
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'car', 'scooter', 'other'],
    default: 'bike',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  assignedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null,
  },
}, {
  timestamps: true,
});

deliveryAgentSchema.index({ location: '2dsphere' }); // for geo queries

const DeliveryAgent = mongoose.model('DeliveryAgent', deliveryAgentSchema);

module.exports = DeliveryAgent;
