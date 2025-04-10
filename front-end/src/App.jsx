import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Product from "./pages/Product";
import Navbar from "./components/Navbar";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
import Footer from "./components/Fotter";
import SearchBar from "./components/SearchBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from "./pages/Verify";
import AuthWrapper from './pages/AuthWrapper';
const App = () => {
 
  useEffect(() => {
    AOS.init({
      // Global settings (optional):
      offset: 200,     // Trigger animation when element is 200px from viewport
      duration: 1000,  // Animation duration in milliseconds
      easing: 'ease',  // Easing type (e.g., 'ease', 'ease-in-out')
      once: false,     // Whether animation should happen only once
    });
    window.addEventListener('scroll', AOS.refresh);
  return () => window.removeEventListener('scroll', AOS.refresh);
  }, []); 

  return ( <>
  <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
    <ToastContainer/>
    <Navbar/>
    <SearchBar/>
  <Routes>
  <Route path="/" element={
        <AuthWrapper>
          <Home />
        </AuthWrapper>
      }/> 
      <Route path="/collection" element={
        <AuthWrapper>
          <Collection />
        </AuthWrapper>
      }/>
  <Route path="/" element={<Home/>}/>
  <Route path="/cart" element={<Cart/>}/>
  <Route path="/about" element={<About/>}/>
  <Route path="/contact" element={<Contact/>}/>
  <Route path="/login" element={<Login/>}/>
  <Route path="/orders" element={<Orders/>}/>
  <Route path="/place-order" element={<PlaceOrder/>}/>
  <Route path="/product/:productId" element={<Product/>}/>
  <Route path="verify" element={<Verify/>}/>
  </Routes>
  <Footer/>
  </div>
  </> );
}
 
export default App;
