import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { Star } from "lucide-react";
import RelatedProducts from "../components/RelatedProducts";


const Product = () => {
    const {productId} = useParams();
    const {products,currency, addtocart} =useContext(ShopContext);
    const [size,setSize] = useState('')
    const [productData, setProductData] = useState(false)
    const [images,setImage] = useState('')
    const fetchProductData = async() =>{
    products.map((item)=>{
        if(item._id === productId){
        setProductData(item)
        setImage(item.images[0])
       
        return null;
        }
    })
    }
    useEffect(()=>{
    fetchProductData()
    },[productId,products])
    return productData ? ( <>
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
        <div className="flex gap-12 sm:flex-12 flex-col sm:flex-row">
            <div className="flex flex-1 flex-col-reverse sm:flex-row gap-3">
                <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll product justify-between sm:justify-normal sm:w-[18.7%] w-full">
                {
                    productData.images.map((item,index)=>{ return(
                     <img src={item} key={index} className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer" onClick={()=> setImage(item)}/>
                    )})
                }
                </div>
                <div className="w-full sm:w-[80%]">
                <img src={images} className="w-96 mx-auto h-auto" />
                </div>
            </div>
        <div className="flex-1">
      <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
      <div className="flex items-center gap-1 mt-2 ">
      <img src={assets.star} className="w-7"/>
      <img src={assets.star} className="w-7"/>
      <img src={assets.star} className="w-7"/>
      <img src={assets.star} className="w-7"/>
     <Star className="w-7 text-[#FFD700]"/>(122)
      </div>
      <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
      <p className="mt-5 text-gray-500 md:w-4/5 capitalize ">{productData.description}</p>
      <div className="flex flex-col gap-4 my-8">
        <p className=""> Select Size</p>
        <div className="flex gap-2">
            {productData.size.map((item,index)=>(
            <button className={`border py-2 px-4 bg-gray-100 ${item === size ? "border-orange-500" : ""}`} key={index} onClick={()=>setSize(item)}>{item}</button>
            ))}
        </div>
      </div>
      <button className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700" onClick={()=>addtocart(productData._id,size)}>Add to Cart</button>
       <hr className="mt-8 sm:w-4/5"/>
       <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
        <p className="">100% Original Product</p>
        <p className="">Cash on delivary is avaliable on this product</p>
        <p className="">Easy return and exchange policy within 7 days</p>
       </div>
        </div>
        </div>
        <div className="mt-20">
          <div className="flex">
        <b className="border px-5 py-3 text-sm">Description</b>
        <p className="border px-5 py-3 text-sm">Reviews(122)</p>
          </div>
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <p className="capitalize">indulge in the finest luxury goods from around the world, carefully 
                curated to provide an unparalleled shopping experience. our e-commerce boutique offers
                an exquite selection of high-end fashion, accessories, and lifestyle products, showcasing the creme 
                of luxury brands
            </p>
            <p className="capitalize">Browser our curated collections,featuring the latest trends and 
                timeless classics.whether you're a connoisseur of luxury or simply seeking to elevate
                your style,<span className="font-joseph font-bold text-xl">Rattle</span> is your ultimate destination 
                for the finest things in life
            </p>
          </div>
        </div>
      <RelatedProducts categories={productData.categories} subCategorie={productData.subCategorie}/>
    </div>
    </> ) : <div className="opacity-0">

    </div>;
}
 
export default Product;