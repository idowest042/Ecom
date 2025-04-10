import OrderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"
import axios from "axios"
//global variables
const currency = "usd"
const deliveryCharge = 5
const DOLLAR_TO_NAIRA_RATE = 1500; 
//gateway initialize 
const stripe = new Stripe(process.env.STRIPE_SECRET)


// placeorder using cash on delivery
export const placeOrder = async (req, res) => {
    try {
        const { address, items, amount } = req.body;
        const userId = req.user._id; // Get from auth middleware

        // Minimal required order data
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: req.body.paymentMethod || "cod", // Default to cod if not specified
            payment: false,
            status: "Order Placed",
            date: Date.now()
        };

        const order = await OrderModel.create(orderData);
        res.status(200).json({ 
            success: true,
            order, // This will include the _id
            amount: amount, // original dollar amount
  amountInNaira: verification.data.data.amount / 100, // converted naira amount
  exchangeRate: DOLLAR_TO_NAIRA_RATE
        });
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to create order",
            error: error.message 
        });
    }
}
export const placeOrderStripe = async (req, res) => {
    try {
        const {address,amount,userId,items} = req.body
        const {origin} = req.headers
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod:"Stripe",
            payment:false,
            date:Date.now()
        }
        const order = new OrderModel(orderData)
        await order.save()
        const line_items = items.map((item) => ({
            price_data:{
            currency:currency,
             product_data:{
                name:item.name,
             },
                unit_amount:item.price * 100,

            },
            quantity:item.quantity,
        }))
        line_items.push({
            price_data:{
                currency:currency,
                product_data:{
                    name:"Delivery Charge",
                },
                unit_amount:deliveryCharge * 100,
            },
            quantity:1
        })
        const session = await stripe.checkout.sessions.create({
            success_url:`${origin}/verify?sucess=true&orderId=${order._id}`,
            cancel_url:`${origin}/verify?sucess=false&orderId=${order._id}`,
            line_items,
            mode:'payment',
        })
        res.status(200).json({session_url:session.url})

    } catch (error) {
        console.log(error.message)
    res.status(500).json({message:error.message})
    }
}


export const allOrders = async (req, res) => {
    try{
     const orders = await OrderModel.find({})
     res.status(200).json({orders})
    }catch(error){
        console.log(error)
        res.status(500).json({message:error.message})
    }
}
export const userOrders = async (req, res) => {
try {
    const {userId} = req.body
    const orders = await OrderModel.find({userId})
    res.status(200).json({orders})
} catch (error) {
    console.log(error.message)
    res.status(500).json({message:error.message})
}
}
export const updateStatus = async (req, res) => {
    try{
    const {orderId,status} = req.body
    await OrderModel.findByIdAndUpdate(orderId,{status})
    res.status(200).json({message:'Status Updated'})

    }catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
}
export const verifyStripe = async(req,res)=>{
    const {orderId,success,userId} = req.body
    try{
    if(success === 'true'){
        await OrderModel.findByIdAndUpdate(orderId,{payment:true})
        await userModel.findByIdAndUpdate(userId,{cartData:{}})
        res.status(200).json({message:"Payment Successfull"})
    }else{
        await OrderModel.findByIdAndDelete(orderId)
        res.status(200).json({message:"Payment Failed"})
    }
    }catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
} 
export const initiatePaystack = async (req, res) => {
    try {
        const { email, amount, metadata } = req.body;
        const amountInNaira = amount * DOLLAR_TO_NAIRA_RATE;
    const amountInKobo = Math.round(amountInNaira * 100); 
        // 1. First validate required fields
        if (!email || !amount) {
            return res.status(400).json({ message: "Email and amount are required" });
        }

        // 2. Convert amount to kobo (Paystack uses smallest currency unit)
    

        // 3. Generate a unique reference
        const reference = `paystack_${Date.now()}`;

        // 4. Call Paystack API
        const paystackResponse = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: amountInKobo,
                reference,
                metadata,
                callback_url: `${req.headers.origin}/verify-paystack?redirect=/orders` 
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // 5. Return Paystack's response to frontend
        res.json(paystackResponse.data);

    } catch (error) {
        console.error("Paystack initialization error:", error.response?.data || error.message);
        res.status(500).json({
            message: "Failed to initialize payment",
            error: error.response?.data?.message || error.message
        });
    }
};
export const verifyPaystack = async (req, res) => {
    try {
        const { reference } = req.query;
        
        // 1. Verify payment with Paystack
        const verification = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
                }
            }
        );

        console.log("Paystack Verification Data:", verification.data); // Debug log

        // 2. Only proceed if payment was successful
        if (verification.data.data.status !== 'success') {
            return res.redirect('/payment-failed');
        }

        // 3. Extract metadata from Paystack response
        const { metadata } = verification.data.data;
        
        // 4. Create the order record
        const newOrder = await OrderModel.create({
            userId: req.user._id,
            items: metadata.items,
            amount: verification.data.data.amount / 100, // Convert from kobo
            address: metadata.address,
            paymentMethod: 'Paystack',
            payment: true,
            status: 'Payment Verified',
            date: Date.now()
        });

        console.log("Order created:", newOrder); // Debug log

        // 5. Clear user's cart
        await userModel.findByIdAndUpdate(req.user._id, { cartData: {} });

        // 6. Redirect to orders page
        return res.redirect('/orders');

    } catch (error) {
        console.error("CRITICAL PAYSTACK ERROR:", {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        return res.redirect('/payment-failed');
    }
};