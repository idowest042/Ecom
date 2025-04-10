import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import {toast} from "react-toastify"

const Add = () => {
    const [image1,setImage1] = useState(false)
    const [image2,setImage2] = useState(false)
    const [image3,setImage3] = useState(false)
    const [image4,setImage4] = useState(false)
    const [isloading,setIsLoading] = useState(false)
    const [name, setName] = useState('');
    const[description,setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category,setCategory] = useState('Men')
    const [subCategory,setSubCategory] = useState('Tops')
    const[bestseller,setBestseller] = useState(false)
    const [size,setSize] = useState([])
    const onSubmitHandler = async(e)=>{
       e.preventDefault();
       setIsLoading(true);
       try {
        const formData = new FormData()
        formData.append('name',name)
        formData.append('description',description)
        formData.append('price',price)
        formData.append('category',category)
        formData.append('subCategory',subCategory)
        formData.append('bestseller',bestseller)
        formData.append('size',JSON.stringify(size))
        image1 &&formData.append('image1',image1)
        image2 &&formData.append('image2',image2)
        image3 &&formData.append('image3',image3)
        image4 &&formData.append('image4',image4)
        const response = await axios.post(
            `${backendUrl}/api/product/add`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                "token": localStorage.getItem("token"), // ✅ Match backend expectation
                 "Authorization": `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        console.log(response)
        if(response.data){
            toast.success(response.data.message || "product added successfully")
            setName('')
            setDescription('')
            setImage1(false)
            setImage2(false)
            setImage3(false)
            setImage4(false)
            setPrice('')
        }else{
            toast.error(response.data.message)
        }
       } catch (error) {
        console.log(error)
        toast.error(error.message)
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            window.location.href = "/login"; // Force redirect
          }
       }finally{
        setIsLoading(false);
      }
    }
    return ( 
        <form action="" onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
        <div className="">
            <p className="mb-2">Upload Image</p>
            <div className="flex gap-2">
                <label htmlFor="image1">
                    <img src={!image1 ?assets.upload_area:URL.createObjectURL(image1)} alt="" className="w-20 h-20" />
                    <input type="file" name="" id="image1" hidden onChange={(e)=>setImage1(e.target.files[0])} />
                </label>
                <label htmlFor="image2">
                    <img src={!image2 ?assets.upload_area:URL.createObjectURL(image2)} alt="" className="w-20 h-20" />
                    <input type="file" name="" id="image2" hidden onChange={(e)=>setImage2(e.target.files[0])} />
                </label>
                <label htmlFor="image3">
                    <img src={!image3 ?assets.upload_area:URL.createObjectURL(image3)} alt="" className="w-20 h-20" />
                    <input type="file" name="" id="image3" hidden onChange={(e)=>setImage3(e.target.files[0])} />
                </label>
                <label htmlFor="image4">
                    <img src={!image4 ?assets.upload_area:URL.createObjectURL(image4)} alt="" className="w-20 h-20" />
                    <input type="file" name="" id="image4" hidden onChange={(e)=>setImage4(e.target.files[0])} />
                </label>
            </div>
        </div>
        <div className="w-full">
            <p className="mb-2">Product name</p>
            <input onChange={(e)=>setName(e.target.value)} value={name} type="text" name="" id="" placeholder="Type here" required className="w-full max-w-[500px] px-3 py-2" />
        </div>
        <div className="w-full">
            <p className="mb-2">Product description</p>
            <textarea type="text" name="" id="" onChange={(e)=>setDescription(e.target.value)} value={description} placeholder="Write content here" required className="w-full max-w-[500px] px-3 py-2" />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
            <div className="">
                <p className="mb-2">Product Category</p>
                <select onChange={(e)=>setCategory(e.target.value)} value={category}  className="w-full px-3 py-2">
                    <option value="Men" className="">Men</option>
                    <option value="Women" className="">Women</option>
                    <option value="Kids" className="">Kids</option>
                </select>
            </div>
            <div className="">
    <p className="mb-2">Sub Category</p> {/* Just a label, no onChange */}
    <select 
        onChange={(e) => setSubCategory(e.target.value)} 
        value={subCategory} 
        className="w-full px-3 py-2"
    >
        <option value="gown">Gown</option>
        <option value="Tops and Bottoms">Tops and Bottoms</option>
        <option value="Tops">Tops</option>
        <option value="Bottom wear">Bottom wear</option> {/* Fixed typo: "Bottm" → "Bottom" */}
        <option value="Winter wear">Winter wear</option>
    </select>
</div>
            <div className="">
                <p className="mb-2">Product Price</p>
                <input type="number" name="" id="" placeholder="25" className="w-full px-3 py-2 sm:[120px]" onChange={(e)=>setPrice(e.target.value)} value={price} />
            </div>
        </div>
        <div className="">
            <p className="mb-2">Product Sizes</p>
            <div className="flex gap-3">
            <div className="flex gap-3">
    {['S', 'M', 'L', 'XL', 'XXL'].map((sizeOption) => (
        <div 
            key={sizeOption}
            onClick={() => setSize(prev => 
                prev.includes(sizeOption) 
                    ? prev.filter(item => item !== sizeOption) 
                    : [...prev, sizeOption]
            )}
            className="cursor-pointer"
        >
            <p className={`px-3 py-1 ${
                size.includes(sizeOption) ? "bg-pink-300" : "bg-slate-200"
            }`}>
                {sizeOption}
            </p>
        </div>
    ))}
</div>
            </div>
        </div>
        <div className="glex gap-2 mt-2">
            <input type="checkbox" name="" id="bestseller" onChange={(e)=>setBestseller(prev => !prev)} checked={bestseller}/>
            <label htmlFor="bestseller" className="cursor-pointer">Add to bestseller</label>
        </div>
        <button className="w-28 py-3 mt-4 bg-black text-white" type="submit">
        {isloading ? "Loading..." : "Add"}
           
        </button>
        </form>
     );
}
 
export default Add;
