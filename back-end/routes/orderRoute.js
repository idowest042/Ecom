import express from "express"
import { placeOrder,placeOrderStripe,allOrders,userOrders,updateStatus,verifyPaystack,initiatePaystack } from "../controllers/orderController.js"
import { adminAuth } from "../middleware/adminAuth.js"
import { authUser } from "../middleware/auth.js"
const orderRouter = express.Router()

//Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)
//Payment Features
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/verify-paystack', authUser, verifyPaystack);
//User Features
orderRouter.post('/userorders',authUser,userOrders)
orderRouter.post('/verifyPaystack',authUser,verifyPaystack)
orderRouter.post('/initiatePaystack',authUser,initiatePaystack)
export default orderRouter