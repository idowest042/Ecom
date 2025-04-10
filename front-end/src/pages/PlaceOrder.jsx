import Title from "../components/Title";
import CardTotal from "../components/CardTotal";
import { assets } from "../assets/assets";
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
    const { navigate, token, cartItem, backendUrl, setCartItem, getCartAmount, delivery_fee, products } = useContext(ShopContext);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData((data) => ({ ...data, [name]: value }));
    };

    const [method, setMethod] = useState('cod');
    const [isloading, setIsloading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsloading(true);

        try {
            let orderItems = [];
            for (const items in cartItem) {
                for (const item in cartItem[items]) {
                    if (cartItem[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items));
                        if (itemInfo) {
                            itemInfo.size = item;
                            itemInfo.quantity = cartItem[items][item];
                            orderItems.push(itemInfo);
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee,
            };

            switch (method) {
                case 'cod':
                    const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
                        headers: { token }
                    });
                    if (response.data) {
                        setCartItem({});
                        navigate('/orders');
                    } else {
                        toast.error(response.data.message);
                    }
                    break;

                case 'stripe':
                    const responseStripe = await axios.post(`${backendUrl}/api/order/stripe`, orderData, {
                        headers: { token }
                    });
                    if (responseStripe.data) {
                        const { session_url } = responseStripe.data;
                        window.location.replace(session_url);
                    } else {
                        toast.error(responseStripe.data.message);
                    }
                    break;

                    case 'Paystack':
  try {
    const response = await axios.post(
      `${backendUrl}/api/order/initiatePaystack`,
      {
        email: formData.email,
        amount: getCartAmount() + delivery_fee,
        metadata: {
          address: formData,
          items: orderItems
        }
      },
      { headers: { token } }
    );

    console.log('Full Paystack Response:', response.data); // Debug log

    // Correct way to access the authorization URL
    const authUrl = response.data.data?.authorization_url;
    
    if (!authUrl) {
      console.error('Authorization URL missing in:', response.data);
      throw new Error(
        response.data.message || 
        'Payment gateway responded but no redirect URL found'
      );
    }

    window.location.href = authUrl;
  } catch (error) {
    console.error('Payment Error Details:', {
      response: error.response?.data,
      message: error.message,
      stack: error.stack
    });
    
    toast.error(
      error.response?.data?.message || 
      error.message || 
      "Payment processing failed"
    );
  }
  break;

                default:
                    toast.error("Please select a valid payment method");
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsloading(false);
        }
    };

    return (
        <>
            <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
                <div className="flex flex-col gap-4 w-full sm:max-w-[450px]">
                    <div className="text-xl sm:text-2xl my-3">
                        <Title text1={"Delivery"} text2={"Information"} />
                    </div>
                    <div className="flex gap-3">
                        <input required type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="First Name" value={formData.firstName} onChange={onChangeHandler} name="firstName" />
                        <input required type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Last Name" value={formData.lastName} onChange={onChangeHandler} name="lastName" />
                    </div>
                    <input required type="email" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Email address" value={formData.email} onChange={onChangeHandler} name="email" />
                    <input required type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Street" value={formData.street} onChange={onChangeHandler} name="street" />
                    <div className="flex gap-3">
                        <input required type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="City" value={formData.city} onChange={onChangeHandler} name="city" />
                        <input required type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="State" value={formData.state} onChange={onChangeHandler} name="state" />
                    </div>
                    <div className="flex gap-3">
                        <input required type="number" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Zipcode" value={formData.zipcode} onChange={onChangeHandler} name="zipcode" />
                        <input required type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Country" value={formData.country} onChange={onChangeHandler} name="country" />
                    </div>
                    <input required type="number" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Phone" value={formData.phone} onChange={onChangeHandler} name="phone" />
                </div>
                <div className="mt-8">
                    <div className="mt-8 min-w-80">
                        <CardTotal />
                        <div className="mt-12">
                            <Title text1={"Payment"} text2={"Method"} />
                            <div className="flex gap-3 flex-col lg:flex-row">
                                <div onClick={() => setMethod('stripe')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                                    <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                                    <img src={assets.stripe} className="h-5 mx-4" />
                                    <p className="italic text-gray-400">Pay with foreign Card</p>
                                </div>

                                <div onClick={() => setMethod('Paystack')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                                    <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'Paystack' ? 'bg-green-400' : ''}`}></p>
                                    <img src={assets.Paystack} className="h-5 w-10 mx-4" />
                                    <p className="italic text-gray-400">Pay with Naira Card</p>
                                </div>

                                <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                                    <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                                    <p className="italic text-gray-500 text-sm font-medium mx-4">Cash On Delivery</p>
                                </div>
                            </div>
                            <div className="w-full text-end mt-8">
                                <button type='submit' className="bg-black px-16 py-3 text-white text-sm">
                                    {isloading ? 'loading...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default PlaceOrder;
