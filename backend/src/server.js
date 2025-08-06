require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'); 
const rateLimit = require('express-rate-limit');

// Routes
const authRoutes = require('./routes/authRoutes');
const googleAuthRoutes = require('./routes/googleauth');
const protectedRoutes = require('./routes/protectedroles');
const userRoutes = require('./routes/userroute');
const vendorAdminRoutes = require('./routes/vendoradminroute');
const vendorRoutes = require('./controllers/vendorstatus');
const VendorMealroutes = require('./routes/mealsroute');
const Meals = require("./routes/mealsroute")

require('./config/passport');

const app = express();

app.use(helmet());


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: '⚠️ Too many requests from this IP. Try again later.',
});
app.use('/api', apiLimiter);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected', MONGO_URI))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vendor', require('./routes/vendoroutes'));
app.use('/api/admin', vendorAdminRoutes);
app.use('/api', vendorRoutes);
app.use('/api',VendorMealroutes);
app.use('/api', Meals);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
