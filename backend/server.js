const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with error handling and retry logic
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Import routes
const formsRouter = require('./routes/forms');
const responsesRouter = require('./routes/responses');

// Use routes
app.use('/api/forms', formsRouter);
app.use('/api/responses', responsesRouter);

// Enhanced root route with API documentation
app.get('/', (req, res) => {
  res.json({
    status: 'Striform API is running',
    version: '1.0.0',
    endpoints: {
      forms: {
        'GET /api/forms': 'Get all forms',
        'POST /api/forms': 'Create a new form',
        'GET /api/forms/:id': 'Get a specific form',
        'PUT /api/forms/:id': 'Update a form',
        'DELETE /api/forms/:id': 'Delete a form'
      },
      responses: {
        'GET /api/responses/form/:formId': 'Get all responses for a form',
        'POST /api/responses': 'Create a new response'
      }
    },
    healthCheck: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});