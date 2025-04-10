import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { X, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const { pathname } = useLocation();
    
    const isCollectionPage = pathname.includes('collection');
    
    // Show if:
    // - On collection page AND not manually hidden (showSearch !== false)
    // - OR showSearch is explicitly true
    const shouldShow = (isCollectionPage && showSearch !== false) || showSearch;

    if (!shouldShow) return null;

    return (
        <div className="border-t border-b bg-gray-50 text-center">
            <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-2/4">
                <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    type="text" 
                    className="flex-1 outline-none bg-inherit text-sm" 
                    placeholder="Search"
                />
                <Search className="w-4 cursor-pointer" />
            </div>
            <X 
                className="inline size-5 cursor-pointer" 
                onClick={() => setShowSearch(false)}
            />
        </div>
    );
};

export default SearchBar;