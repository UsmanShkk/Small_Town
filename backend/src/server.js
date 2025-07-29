require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const googleAuthRoutes = require('./routes/googleauth'); // optional
const protectedRoutes = require('./routes/protectedroles');

require('./config/passport'); // If you're using Google OAuth

const app = express();

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
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes); // optional
app.use('/api/protected', protectedRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
