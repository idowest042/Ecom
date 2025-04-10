import { useState,useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const {token,setToken,navigate,backendUrl} = useContext(ShopContext)
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [isLoading,setIsLoading] = useState(false)
  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      if(currentState === "Sign Up"){
        const response = await axios.post(backendUrl + `/api/user/register`,{name,email,password})
        toast.success("User created successfully")
        if(response.data){
          setToken(response.data.token)
          localStorage.setItem("token",response.data.token)
          }else{
            toast.error(response.data.message)
          }
        console.log(response.data);
      }else{
        const response = await axios.post(backendUrl + `/api/user/login`,{email,password})
        toast.success("User logged in successfully")
        if(response.data){
          setToken(response.data.token)
          localStorage.setItem("token",response.data.token)
      }
        else{
          toast.error(response.data.message)
        }
        console.log(response.data);
      }
       
    } catch (error) {
      toast.error(error.response.data.message)
    }finally{
      setIsLoading(false)
    }
   
    // Add your login/signup logic here
  };
useEffect(() => {
  if(token){
  navigate('/')}
},[token])
return (
    <form 
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="joseph-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <input
          type="text"
          name="name"
          className="w-full px-3 py-2 border border-gray-900"
          placeholder="Name"
          required
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <input
        type="email"
        name="email"
        className="w-full px-3 py-2 border border-gray-900"
        placeholder="Email"
        required
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        name="password"
        className="w-full px-3 py-2 border border-gray-900"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        
        {currentState === "Login" ? (
          <p 
            className="cursor-pointer" 
            onClick={() => setCurrentState("Sign Up")}
          >
            Create account
          </p>
        ) : (
          <p 
            className="cursor-pointer" 
            onClick={() => setCurrentState("Login")}
          >
            Login
          </p>
        )}
      </div>

      <button 
        type="submit" 
        className="w-full py-2 bg-black text-white mt-4"
      >
        {isLoading? "loading...":`${currentState}`}
      </button>
    </form>
  );
};

export default Login;