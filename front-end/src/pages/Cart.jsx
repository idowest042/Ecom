import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { Trash } from "lucide-react";
import CardTotal from "../components/CardTotal";
const Cart = () => {
    const {products, currency, cartItem, updateQuantity, navigate,deleteFromCart} = useContext(ShopContext);
    const [cartData, setCartData] = useState([]);
    
    useEffect(() => {
        const tempData = [];
        for(const items in cartItem) {
            for(const item in cartItem[items]) {
                if (cartItem[items][item] > 0) {
                    tempData.push({
                        _id: items,
                        size: item,
                        quantity: cartItem[items][item] ||0
                    });
                }
            }
        }
        setCartData(tempData);
    }, [cartItem, products]);

    // Filter out invalid cart items first
    const validCartItems = cartData.filter(item => {
        const product = products.find(p => p._id === item._id);
        return product && product.images && product.images.length > 0;
    });

    return (
        <div className="border-t pt-14">
            <div className="text-2xl mb-3">
                <Title text1={"Your"} text2={"Cart"}/>
            </div>
            <div className="">
                {validCartItems.length === 0 ? (
                    <p className="py-10 text-center">Your cart is empty</p>
                ) : (
                    validCartItems.map((item, index) => {
                        const productData = products.find(product => product._id === item._id);
                        
                        // Skip rendering if product data is invalid
                        if (!productData || !productData.images || productData.images.length === 0) {
                            return null;
                        }

                        return (
                            <div key={index} className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center">
                                <div className="flex items-start gap-6">
                                    <img 
                                        src={productData.images[0]} 
                                        className="w-16 sm:w-20" 
                                        alt={productData.name} 
                                        onError={(e) => {
                                            e.target.src = '/placeholder-image.jpg'; // Fallback image
                                        }}
                                    />
                                    <div className="">
                                        <p className="text-xs sm:text-lg font-medium">{productData.name}</p>
                                        <div className="flex items-center gap-5 mt-2">
                                            <p>{currency}{productData.price}</p>
                                            <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                                        </div>
                                    </div>
                                </div>
                                <input 
                                    type="number"  
                                    min={1} 
                                    defaultValue={item.quantity} 
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || value === '0') return;
                                        updateQuantity(item._id, item.size, Number(value));
                                    }} 
                                    className="border max-w-10 sm:max-w-10 px-1 sm:px-2" 
                                />
                                <Trash 
                                    className="w-4 mr-4 cursor-pointer" 
                                    onClick={() => deleteFromCart(item._id, item.size, 0)}
                                />
                            </div>
                        );
                    })
                )}
            </div>
            {validCartItems.length > 0 && (
                <div className="flex justify-end my-20">
                    <div className="w-full sm:w-[450px]">
                        <CardTotal/>
                        <div className="w-full text-end">
                            <button 
                                className="bg-black text-white text-sm my-8 px-8 py-3" 
                                onClick={() => navigate('/place-order')}
                            >
                                Proceed To Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Cart