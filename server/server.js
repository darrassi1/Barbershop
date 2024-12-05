const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const appointmentRoute = require('./routes/appointment');
const profileRoute = require('./routes/profile');

dotenv.config();
const app = express();

// Extremely permissive CORS configuration
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const uri = "mongodb+srv://younesdarrassi:test@123,@clusterbarbershop.iav48.mongodb.net/?retryWrites=true&w=majority&appName=Clusterbarbershop";

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      serverApi: { version: '1', strict: true, deprecationErrors: true }
    });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Add a simple health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

app.use('/', authRoute);
app.use('/', appointmentRoute);
app.use('/', profileRoute);

module.exports = app;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});