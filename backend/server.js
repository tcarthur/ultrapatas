require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const appointmentRoutes = require('./src/routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(morgan('dev'));

// Capture raw request body for debugging in development
app.use(express.json({
  verify: (req, res, buf) => {
    if (process.env.NODE_ENV === 'development') {
      try {
        req.rawBody = buf.toString();
      } catch (e) {
        req.rawBody = '';
      }
    }
  }
}));

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development' && req.rawBody) {
    console.log('\n--- RAW BODY START ---');
    console.log(req.rawBody);
    console.log('--- RAW BODY END ---\n');
  }
  next();
});

app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Ultrapatas API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/appointments', appointmentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ultrapatas API running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
