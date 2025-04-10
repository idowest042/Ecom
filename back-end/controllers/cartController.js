import userModel from "../models/userModel.js"

export const addToCart = async (req, res) => {
    try {
      const { userId, itemId, size } = req.body;
      const userData = await userModel.findById(userId);
      let cartData = userData.cartData || {}; // Initialize if undefined
  
      if (cartData[itemId]) {
        if (cartData[itemId][size]) {
          // Handle both cases: number or object
          if (typeof cartData[itemId][size] === 'number') {
            cartData[itemId][size] = { quantity: cartData[itemId][size] + 1 };
          } else {
            cartData[itemId][size].quantity += 1;
          }
        } else {
          cartData[itemId][size] = { quantity: 1 }; // Always store as object
        }
      } else {
        cartData[itemId] = {};
        cartData[itemId][size] = { quantity: 1 }; // Initialize as object
      }
  
      await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
      res.status(200).json({ message: 'Item added to cart successfully' });
  
    } catch (error) {
      console.error("Error in addToCart:", error);
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }
export const updateCart =async (req,res) => {
try {
    const {userId,size,itemId,quantity} = req.body
    const userData = await userModel.findById(userId)
    let cartData = await userData.cartData;
    cartData[itemId][size] = quantity;
    await userModel.findByIdAndUpdate(userId, {cartData}, {new:true})
res.status(200).json({message:'Cart updated successfully'})

} catch (error) {
    console.log(error,"error in addToCart")
    res.status(500).json({message:'Internal server error' || error.message})
}
}
export const getUserCart = async(req,res) => {
try{
const {userId} = req.body;
const userData = await userModel.findById(userId)
    let cartData = await userData.cartData;
    res.status(200).json({cartData})
}catch(error){
    console.log(error,"error in addToCart")
    res.status(500).json({message:'Internal server error' || error.message})
}
}
export const deleteFromCart = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { itemId, sizes } = req.body;

    // Debugging logs - add these
    console.log(`[DeleteCart] UserID: ${userId}, ItemID: ${itemId}, Sizes: ${sizes}`);
    
    if (!userId || !itemId || !sizes || !Array.isArray(sizes)) {
      return res.status(400).json({ 
        message: "userId, itemId and sizes array are required" 
      });
    }

    const user = await userModel.findById(userId).lean();
    console.log(`[DeleteCart] User Found:`, user ? user._id : 'null');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure cartData exists and is an object
    const cartData = user.cartData || {};
    console.log(`[DeleteCart] CartData:`, JSON.stringify(cartData));

    if (!cartData[itemId]) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    let deletedAny = false;
    const updatedCart = { ...cartData };

    sizes.forEach(size => {
      if (updatedCart[itemId] && updatedCart[itemId][size]) {
        delete updatedCart[itemId][size];
        deletedAny = true;
      }
    });

    // Clean up empty items
    if (Object.keys(updatedCart[itemId]).length === 0) {
      delete updatedCart[itemId];
    }

    if (!deletedAny) {
      return res.status(404).json({ message: "No matching sizes found" });
    }

    await userModel.findByIdAndUpdate(userId, { cartData: updatedCart });
    return res.status(200).json({ message: "Sizes removed successfully" });

  } catch (error) {
    console.error("[DeleteCart] Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};