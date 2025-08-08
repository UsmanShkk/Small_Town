const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  foodType: { type: [String], default: [] },

  
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point', 
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },

  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

  createdAt: { type: Date, default: Date.now },
});


vendorSchema.index({ location: '2dsphere' });

//  Encrypt password before saving
vendorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Compare password method
vendorSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Vendor', vendorSchema);
