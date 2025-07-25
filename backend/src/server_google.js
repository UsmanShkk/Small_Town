// server.js or app.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/passport');// Google Strategy config

const app = express();
dotenv.config();

app.use(express.json());
app.use(passport.initialize());

// Routes
const authRoutes = require('./routes/googleauth');
app.use('/api/auth', authRoutes);

// Connect to DB and start server
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => console.log('Server running on port 5000'));
});
