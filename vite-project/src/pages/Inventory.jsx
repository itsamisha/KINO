import "../css/Inventory.css";
import Navbar from "../component/NavbarSeller/NavbarSeller";
import Sidebar from "../component/SellerSidebar/SellerSidebar";
import { useSellerAuth } from "../context/SellerAuthContext";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import InventoryItem from "../component/InventoryItem/InventoryItem";
const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn, authUser } = useSellerAuth();
  const userId = authUser.user_id;
  
  if (!isLoggedIn) {
    return <Navigate to="/signin"/>
  }
  
  const getInventory = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/seller/${userId}/inventory`
      );
      const data = await response.json();
      console.log(data);
      setProducts(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getInventory();
  }, []);

  const filteredProducts = Array.isArray(products)
  ? products.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];
  

  return (
    <div className="container">
     <Navbar/>
      <Sidebar />
      <h2 className="header">◧ INVENTORY</h2>
      
      <input
        type="text"
        placeholder="Search inventory..."
        value={searchQuery}
        className="searchWishlist"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <br /><br /><br />
      {products.length > 0 ? (
        filteredProducts.map((item) => (
          <>
            <InventoryItem
              key={item.product_id}
              id={item.product_id}
              name={item.name}
              photo={item.photo_url}
            />
            <br />
          </>
        ))
      ) : (
        <Link to="/">
          <h1>Wishlist empty</h1>
        </Link>
      )}
    </div>
  );
};

export default Inventory;
