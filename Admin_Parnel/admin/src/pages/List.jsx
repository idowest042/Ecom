import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({token}) => {
    const [list,setList] = useState([])
    const fetchList = async()=>{
  try {
    const response = await axios.get(backendUrl + `/api/product/list`)
    if (response.data) {
        setList(response.data.products)
    } else {
        toast.error(response.data.message)
    }
    
  } catch (error) {
    if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        window.location.href = "/login"; // Force redirect
      }
    console.log(error)
    toast.error(error.message)
  }
    }
    
    const removeProduct = async (productId) => {
        try {
            const response = await axios.delete(
                `${backendUrl}/api/product/remove`,
                {
                    data: { id: productId }, // Consistent field name
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (response.data.success) {
                toast.success(response.data.msg);
                await fetchList();
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || "Failed to delete product");
            if (error.response?.status === 401) {
                // Token expired or invalid
                localStorage.removeItem("token");
                window.location.href = "/login"; // Force redirect
              }
        }
    };
    useEffect(()=>{
      fetchList()
    },[fetchList])
    return ( 
        <div className="">
            <p className="mb-2">All Products List</p>
            <div className="flex flex-col gap-2">
                <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
                    <b className="">Image</b>
                    <b className="">Name</b>
                    <b className="">Category</b>
                    <b className="">Price</b>
                    <b className="text-center">Action</b>
                </div>
                {
                    list.map((item,index)=>(
                   <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm" key={index}>
                    <img src={item.images[0]} alt="" className="w-12"/>
                    <p className="">{item.name}</p>
                    <p className="">{item.category}</p>
                    <p className="">{currency}{item.price}</p>
                    <p className="text-right md:text-center cursor-pointer text-lg" onClick={()=>removeProduct(item._id)}>X</p>
                   </div>
                    ))
                }
            </div>
        </div>
     );
}
 
export default List;
