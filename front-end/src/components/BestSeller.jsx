import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItems from "./ProductItem";

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);
    
    useEffect(() => {
        if (products && products.length > 0) {
            // Changed from bestSeller to bestseller to match your data
            const bestProducts = products.filter(item => item.bestseller === true);
            setBestSeller(bestProducts.slice(0, 5));
        }
    }, [products]); // Added products to dependency array

    return (
        <div className="my-10">
            <div className="text-center text-3xl py-8" >
                <Title text1={"Best"} text2={"Sellers"}/>
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 capitalize" >
                    Exquisite elegance, refined sophistication. Our luxurious collection embodies
                    opulence, with intricate details, sumptuous fabrics, and flawless craftsmanship
                </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 gap-4" >
                {bestSeller.map((item) => (
                    <ProductItems 
                        key={item._id} // Use _id instead of index for better key
                        id={item._id} 
                        name={item.name} 
                        images={item.images}
                        price={item.price}
                    />
                ))}
            </div>
        </div>
    );
};

export default BestSeller;