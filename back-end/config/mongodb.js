import mongoose from "mongoose"; 
export const connectDB = async()=>{
    mongoose.connection.on('connected', ()=>{
        console.log('Db connected')
    })
await mongoose.connect(`${process.env.MONGODB_URI}`)
}