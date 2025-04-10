import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Allproducts } from "../assets/assets";

// 1. First create the context
const ShopContext = createContext();

// 2. Create a custom hook for easy consumption
export function useShopContext() {
  return useContext(ShopContext);
}

// 3. Create the provider component
export function ShopContextProvider({ children }) {
  const [search, setSearch] = useState("");
  const [token, setToken] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const [products, setProducts] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const addtocart = async (itemId, size) => {
    let cardData = structuredClone(cartItem);
    if (!size) {
      toast.error("Select product size");
      return;
    }

    if (cardData[itemId]) {
      if (cardData[itemId][size]) {
        cardData[itemId][size] += 1;
      } else {
        cardData[itemId][size] = 1;
      }
    } else {
      cardData[itemId] = {};
      cardData[itemId][size] = 1;
    }

    setCartItem(cardData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { userId, itemId, size },
          { headers: { token } }
        );
        await getUserCart(token); // refresh after update
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to add to cart");
      }
    }
  };
  const deleteFromCart = async (itemId, size) => {
    try {
      if (!itemId || !size) {
        toast.error("Item ID and size are required");
        return;
      }
  
      // Clone and update local cart
      const updatedCart = { ...cartItem };
      if (updatedCart[itemId]?.[size]) {
        delete updatedCart[itemId][size];
        
        // Remove item if no sizes left
        if (Object.keys(updatedCart[itemId]).length === 0) {
          delete updatedCart[itemId];
        }
        
        setCartItem(updatedCart);
      }
  
      // Sync with backend if logged in
      if (token) {
        await axios.delete(`${backendUrl}/api/cart/delete`, {
          data: { 
            itemId, 
            sizes: [size] // Send as array to match backend
          },
          headers: { token }
        });
        toast.success("Item removed from cart");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity;
    setCartItem(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { userId, itemId, size, quantity },
          { headers: { token } }
        );
        await getUserCart(token); // refresh after update
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to update quantity");
      }
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        { userId },
        { headers: { token } }
      );
      if (response.data) {
        const serverCart = response.data.cartData;

        // Normalize cart structure if needed
        const cleanCart = {};
        for (const itemId in serverCart) {
          cleanCart[itemId] = {};
          for (const size in serverCart[itemId]) {
            const value = serverCart[itemId][size];
            cleanCart[itemId][size] = typeof value === "object" ? value.quantity : value;
          }
        }

        setCartItem(cleanCart);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch cart");
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data?.message || "No products found");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to load products");
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalCount += cartItem[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItem) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0 && itemInfo) {
            totalAmount += itemInfo.price * cartItem[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    console.log(cartItem);
  }, [cartItem]);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (!token && localToken) {
      setToken(localToken);
      getUserCart(localToken);
    }
  }, []);

  const value = {
    products,
    Allproducts,
    currency: "$",
    delivery_fee: 5,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItem,
    addtocart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    setCartItem,
    deleteFromCart
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

// 4. Named export for the context itself (optional)
export { ShopContext };
