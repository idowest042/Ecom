import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { showSearch, setShowSearch, getCartCount,navigate,token,setToken,setCartItem} = useContext(ShopContext);
const logout = async ()=>{
try{
localStorage.removeItem("token")
  setToken("")
  setCartItem({})
  navigate("/login")
   toast.success("User logged out successfully")
}catch(error){
toast.error(error.response.data.message)
}
  
}
  return (
    <nav className="flex items-center justify-between py-5 px-4 relative">
      {/* Logo */}
      <Link to="/" className="text-3xl font-bold font-joseph inline-block" data-aos="fade-down" data-aos-once="false" data-aos-duration="1000">
        Rattle
      </Link>

      {/* Desktop Links (hidden on mobile) */}
      <div className="hidden lg:flex gap-8">
        <NavLink to="/" data-aos="slide-left">Home</NavLink>
        <NavLink to="/contact" data-aos="slide-left" data-aos-delay="100">Contact</NavLink>
        <NavLink to="/about" data-aos="slide-left" data-aos-delay="200">About</NavLink>
        <NavLink to="/collection" data-aos="slide-left" data-aos-delay="300">Collection</NavLink>
      </div>

      {/* Icons (always visible) */}
      <div className="flex items-center gap-4">
        <Search className="w-5 cursor-pointer" onClick={() => setShowSearch(!showSearch)} />
        
        {/* User Dropdown */}
        <div className="group relative" >
          <User className="cursor-pointer size-5" onClick={() => token ? null : navigate("/login")} />
            {token && <div className="group-hover:block hidden absolute z-50 dropdown-menu right-0 pt-4 transition-opacity duration-500 delay-300 hover:block">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded ">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p className="cursor-pointer hover:text-black" onClick={()=>navigate('/orders')}>Orders</p>
              <p className="cursor-pointer hover:text-black" onClick={logout}>Logout</p>
            </div>
          </div>}
         
        </div> {/* Closing the group relative div here */}

        {/* Shopping Cart */}
        <Link to="/cart" className="relative" data-aos="fade-down" data-aos-delay="200">
          <ShoppingCart className="w-5"  />
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {getCartCount()}
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <Menu
          className="w-5 cursor-pointer lg:hidden" data-aos="fade-down" data-aos-delay="300"
          onClick={() => setMobileMenuOpen(true)}
        />
      </div>

      {/* Mobile Menu (simplified) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 p-4 lg:hidden">
          <div className="flex justify-end mb-8">
            <X
              className="w-6 h-6 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
          <div className="flex flex-col gap-6 text-xl">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </NavLink>
            <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>
              About
            </NavLink>
            <NavLink to="/collection" onClick={() => setMobileMenuOpen(false)}>
              Collection
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;