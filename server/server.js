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

// Updated CORS configuration
app.use(cors({
  origin: 'https://barbershop-pearl-seven.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'X-CSRF-Token',
    'X-Requested-With',
    'Accept',
    'Accept-Version',
    'Content-Length',
    'Content-MD5',
    'Content-Type',
    'Date',
    'X-Api-Version',
    'Authorization'
  ]
}));

// Add custom headers middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://barbershop-pearl-seven.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  next();
});

// MongoDB URI from .env
const uri = process.env.MONGO_URI;

async function connectDB() {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri, {
      serverApi: { version: '1', strict: true, deprecationErrors: true }
    });
    console.log("Connected to MongoDB successfully!");
    // Explicitly select the database after connecting
    const dbName = 'barbershopdb';  // Replace with the name of your database
    const db = mongoose.connection.useDb(dbName);
    // Ping MongoDB to ensure connection is working
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
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

// Handle preflight requests for all routes
app.options('*', cors());

// Register routes
app.use('/', authRoute);
app.use('/', appointmentRoute);
app.use('/', profileRoute);

module.exports = app;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
