import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { ArrowRight, LoaderCircle } from "lucide-react";
import Title from "../components/Title";
import ProductItems from "../components/ProductItem";

const Collection = () => {
    const { search,showSearch,products } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortType, setSortType] = useState("relavent")

    // Toggle category selection
    const toggleCategory = (e) => {
        const value = e.target.value;
        setCategories(prev => 
            prev.includes(value) 
                ? prev.filter(item => item !== value) 
                : [...prev, value]
        );
    };

    // Toggle subcategory selection
    const toggleSubCategory = (e) => {
        const value = e.target.value;
        setSubCategories(prev =>
            prev.includes(value)
                ? prev.filter(item => item !== value)
                : [...prev, value]
        );
    };

    // Apply all active filters
   const applyFilters = () => {
    if (!products) return;

    let filteredProducts = products;

    // Apply search filter first
    if (showSearch && search) {
        filteredProducts = filteredProducts.filter(item => 
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Then apply category filter
    if (categories.length > 0) {
        filteredProducts = filteredProducts.filter(item => 
            categories.includes(item.category)
        );
    }

    // Finally apply subcategory filter
    if (subCategories.length > 0) {
        filteredProducts = filteredProducts.filter(item =>
            subCategories.includes(item.subCategory)
        );
    }

    setFilterProducts(filteredProducts);
};
    const sortProduct =() => {
        if (!filterProducts.length) return;
    
    // Create a new array to avoid mutating the original state
    const sortedProducts = [...filterProducts];
    
    switch(sortType) {
        case 'low-high':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'high-low':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        default:
            // For 'relavent', we want the original filtered order
            applyFilters();
            return;
    }
    setFilterProducts(sortedProducts);
    }

    // Initialize products when Allproducts loads
    useEffect(() => {
        if (products) {
            setFilterProducts(products);
            setIsLoading(false);
        }
    }, [products]);

    // Re-apply filters when categories or subcategories change
    useEffect(() => {
        applyFilters();
    }, [categories, subCategories,search,showSearch,products]);
    useEffect(()=>{
     sortProduct()
    },[sortType])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoaderCircle className="animate-spin" size={48} />
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 border-t">
            {/* Filters Sidebar */}
            <div className="min-w-60">
                <p className="my-2 text-xl flex items-center cursor-pointer gap-2" data-aos="fade-down" 
                   onClick={() => setShowFilter(!showFilter)}>
                    Filters
                    <ArrowRight className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}/>
                </p>
                
                {/* Categories Filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
                    <p className="mb-3 text-sm font-medium">Categories</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700" data-aos="fade-down">
                        {["Men", "Women", "Kids"].map(category => (
                            <label key={category} className="cursor-pointer flex gap-2 items-center">
                                <input 
                                    type="checkbox" 
                                    name="category" 
                                    onChange={toggleCategory}
                                    className="w-3" 
                                    value={category}
                                    checked={categories.includes(category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Subcategories Filter */}
                <div className={`border border-gray-300 pl-5 py-3 my-6 ${showFilter ? "" : "hidden"} sm:block`}>
                    <p className="mb-3 text-sm font-medium">Type</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700" data-aos="fade-down" data-aos-delay="100">
                        {["gown", "Tops and Bottoms", "Tops", "Bottom wear", "Winter wear"].map(type => (
                            <label key={type} className="cursor-pointer flex gap-2 items-center">
                                <input 
                                    type="checkbox" 
                                    name="subcategory" 
                                    onChange={toggleSubCategory}
                                    className="w-3" 
                                    value={type}
                                    checked={subCategories.includes(type)}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1={"All"} text2={"Collections"}/>
                    <select className="border-2 border-gray-300 text-sm cursor-pointer px-2" onChange={(e)=>setSortType(e.target.value)}>
                        <option value="relavent">Sort by: Relevant</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>
                
                {filterProducts.length === 0 ? (
                    <div className="text-center py-10">
                        No products match your filters
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6" >
                        {filterProducts.map((item) => (
                            <ProductItems 
                                key={item._id} 
                                id={item._id} 
                                name={item.name} 
                                price={item.price} 
                                images={item.images}
                            
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collection;