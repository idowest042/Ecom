import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './config/mongodb.js'
import { connectCloudinary } from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
const app = express()
const PORT = process.env.PORT || 4000
connectDB()
connectCloudinary()
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(cors())
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.get('/', (req,res)=>{
    res.send('Api working')  
})
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected to database:', mongoose.connection.db.databaseName);
  });
app.listen(PORT,()=>{
console.log(`server is listening at ${PORT}`)
})