import { useEffect,useState } from "react"
import axios from "axios"
import {backendUrl, currency} from '../App'
import { toast } from "react-toastify"
import { assets } from "../assets/assets"

const Orders = ({token}) => {
    const [orders,setOrders] = useState([])
    const [loading,setLoading] = useState(false)
    const fetchAllOrders = async () => {
       if(!token){
        return null
       }
       try{
       const response = await axios.post(backendUrl + '/api/order/list',{},{headers:{ Authorization: `Bearer ${token}` }})
       if(response.data){
        setOrders(response.data.orders.reverse())
       }else{
        toast.error(response.data.message)
       }
       }catch(error){
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            window.location.href = "/login"; // Force redirect
          }
       toast.error(error.message)
       console.log(error)
       }
    }
    const statusHandler = async(e,orderId)=>{
     try{
        const response = await axios.post(backendUrl+'/api/order/status',{orderId, status:e.target.value},{headers:{Authorization:`Bearer ${token}`}})
        if(response.data){
            await fetchAllOrders()
        } 
    }catch(error){
        toast.error(response.data.message)
        console.log(error)
     }
    }
    useEffect(()=>{
     fetchAllOrders()
    },[token])
    return ( 
        <div className="">
            <h3 className="">Order Page</h3>
            <div className="">
                {
                    orders.map((order,index)=>(
                        <div className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700" key={index}>
                            <img src={assets.parcel_icon} alt="" className="w-12" />
                            <div className="">


                            <div className="">
                                {
                                    order.items.map((item,index)=>{
                                     if(index=== order.items.length - 1){
                                        return <p key={index}>{item.name} x {item.quantity}<span className="py-0.5">{item.size}</span></p>
                                     }else{
                                        return <p key={index}>{item.name} x {item.quantity}<span className="py-0.5">{item.size}</span>,</p>
                                     }
                                    })
                                }
                            </div>
                            <p className="mt-3 mb-2 font-medium">{order.address.firstName + " " +  order.address.lastName}</p>
                            <div className="">
                                <p>{order.address.street + ","}</p>
                                <p>{order.address.city + ", "+ order.address.state + "," + order.address.country + ","+order.address.zipcode}</p>
                            </div>
                            <p>{order.address.phone}</p>
                        </div>
                        <div className="">
                            <p className="text-sm sm:text-[15px]">Items : {order.items.length}</p>
                            <p className="mt-3">Method : {order.paymentMethod}</p>
                            <p className="">Payment : {order.payment ? "Done" : "false"}</p>
                            <p className="">Date : {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm sm:text-[15px]">{currency}{order.amount}</p>
                        <select onChange={(e)=>statusHandler(e,order._id)}  className=" cursor-pointer p-2 font-semimedium" value={order.status}>
                            <option value="Order Placed">Order Placed</option>
                            <option value="Packing">Packing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for delivery">Out for delivery</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                        </div>
                    ))
                }
            </div>
        </div>
     );
}
 
export default Orders;