import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItems from "./ProductItem";

const LatestCollection = () => {
    const {products} = useContext(ShopContext);
    const [LatestProducts, setLatestProducts] = useState([]);
    useEffect(()=>{
     setLatestProducts(products.slice(0,10));
    },[products])
    
    return ( <>
    <div className="my-10">
        <div className="text-center py-8 text-3xl">
            <Title text1={"Latest"} text2={"Collection"}  />
            <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 capitalize">
            elevate your style with our luxurious collection of haute couture. exquisite materials,
            meticulous craftsmanship, and refined designs come together to create a truly regal experience
            </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6" >
            {
                LatestProducts.map((item,index)=>(
                 <ProductItems key={index} id={item._id} images={item.images} name={item.name} price={item.price}/>
                ))
            }
        </div>
    </div>
    </> );
}
 
export default LatestCollection;