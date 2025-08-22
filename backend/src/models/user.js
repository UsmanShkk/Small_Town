const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, unique: true, sparse: true },

  password: {
    type: String,
    required: function () {
      return !this.googleId; // password required if not Google user
    },
  },

  role: {
    type: String,
    enum: ['Admin', 'Customer', 'Chef', 'Delivery'],
  },
  cart: [
    {
      meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
      quantity: { type: Number, required: true, default: 1 }
    }
  ]
});

 
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (plainPwd) {
  return await bcrypt.compare(plainPwd, this.password);
};

module.exports = mongoose.model('User', userSchema);
