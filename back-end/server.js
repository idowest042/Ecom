import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/mongodb.js';
import { connectCloudinary } from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to services
connectDB();
connectCloudinary();

// Enhanced CORS configuration
const allowedOrigins = [
  'https://adminparnel.vercel.app',
  'https://rattle-git-main-idowu-josephs-projects.vercel.app',
  'http://localhost:3000' // For local development
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Health check
app.get('/', (req, res) => {
  res.send('API working');
});

// MongoDB connection event
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected to database:', mongoose.connection.db.databaseName);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});