require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Initialize express app
const app = express();

// ✅ CORS middleware should be placed early
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Security headers
// app.use(helmet());

// // ✅ Rate limiting
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: '⚠️ Too many requests from this IP. Try again later.',
// });
// app.use('/api', apiLimiter);

// ✅ Common middlewares
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// ✅ Passport config
require('./config/passport');

// ✅ MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected:', MONGO_URI))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/auth', require('./routes/googleauth'));
app.use('/api/protected', require('./routes/protectedroles'));
app.use('/api/users', require('./routes/userroute'));
app.use('/api/vendor', require('./routes/vendoroutes'));
app.use('/api/admin', require('./routes/vendoradminroute'));
app.use('/api', require('./controllers/vendorstatus'));
app.use('/api', require('./routes/mealsroute'));

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
