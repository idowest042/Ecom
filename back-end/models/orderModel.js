import mongoose from "mongoose";
const orderSchema = mongoose.Schema({
    userId:{type:String, required:true},
    items:{type:Array, required:true},
    amount:{type:Number, required:true},
    address:{type:Object, required:true},
    status:{type:String, required:true,default:"Order Placed"},
    paymentMethod:{type:Object, required:true},
    payment:{type:Boolean,require:true, default:false},
    date:{type:Number,required:true, default:Date.now()}
})
const OrderModel = mongoose.models.order||mongoose.model("Order", orderSchema);
export default OrderModel;