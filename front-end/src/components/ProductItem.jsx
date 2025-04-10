import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItems = (props) => {
    const {currency} = useContext(ShopContext);
    
    // Handle both cases (image or images)
    const imageUrl = props.images?.[0] || props.image || '/placeholder.jpg';
    
    return ( 
        <Link className="text-gray-700 cursor-pointer" to={`/product/${props.id}`}>
            <div className="overflow-hidden h-64" data-aos="fade-down" >
                <img 
                    src={imageUrl} 
                    alt={props.name} 
                    className="hover:scale-110 transition ease-in-out" 
                />
            </div>
            <p className="pt-3 pb-1 text-sm" data-aos="fade-down" data-aos-delay="100">{props.name}</p>
            <p className="text-sm font-medium" data-aos="fade-down" data-aos-delay="200">{currency}{props.price}</p>
        </Link>
    );
}
export default ProductItems;