import userModel from "../models/userModel.js";
import validator from "validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,)
}

export const loginUser = async (req, res) => {
    try {
        const {email,password} = req.body
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({message: "User not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch){
            const token = createToken(user._id)
            return res.status(200).json({
                token,
            })
        }
        else{
            res.status(400).json({message: "Invalid credentials"})
        }
        
    
    } catch (error) {
        console.log('error in loginUser',error)
       return res.status(500).json({msg:"error in loginUser"})
    }
   
}
export const registerUser = async (req,res) => {
    try {
        const {name,email,password} = req.body;
       const exist = await userModel.findOne({email})
       if(exist) {
        return res.status(400).json({message: "User already exists"})
       }
       if(!validator.isEmail(email)){
        return res.status(400).json({message: "Invalid email"})
       }
       if(password.length < 8){
        return res.status(400).json({message: "Password must be at least 8 characters"})
       }
       const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);
         const newUser =new userModel({
            name,
            email,
            password: hashedPassword
         })
       const user = await newUser.save();
       const token =createToken(user._id)
       res.status(201).json({
        token,
        
       })
    } catch (error) {
        res.status(500).json({msg:"error in registerUser"})
        console.log(error)
    }
}
export const adminLogin = async(req,res)=>{
try {
    const {email,password} = req.body
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      // ✅ Correct (payload is an object)
      const token = jwt.sign(
        { 
          email: process.env.ADMIN_EMAIL.trim(), // Trim to be safe
          role: "admin" 
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
        res.status(200).json({token})}
        else{
            res.status(400).json({msg:"Invalid credentials"})
        }
} catch (error) {
    console.log('error in adminLogin',error)
    res.status(500).json({msg:"error in adminLogin"})
}
}