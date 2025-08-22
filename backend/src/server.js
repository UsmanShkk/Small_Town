require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const http = require('http');          // ✅ Add this
const { Server } = require('socket.io'); // ✅ Add this

// Initialize express app
const app = express();

// ✅ CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
app.use('/api', require('./routes/preferences'));
app.use('/api', require('./routes/stripe'));
app.use('/api', require('./routes/orderroutes'));
app.use('/api', require('./routes/agentroutes'));
app.use("/api/mealsplan", require('./routes/mealsplanroute'));
// ✅ Create HTTP server for Socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // frontend URL
    methods: ['GET', 'POST'],
    credentials: true,               // ✅ allow cookies/JWT
  }
});


// ✅ Make io accessible in controllers
app.set('io', io);

// ✅ Socket.io connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Customer joins their order room
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(`order_${orderId}`); // Add 'order_' prefix
    console.log(`Customer joined order room: order_${orderId}`);
  });

  // Vendor joins their vendor room
  socket.on('joinVendorRoom', (vendorId) => {
    socket.join(`vendor_${vendorId}`);
    console.log(`Vendor joined room: vendor_${vendorId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ✅ Start server using HTTP server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
