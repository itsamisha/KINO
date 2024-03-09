import "../css/Inventory.css";
import Navbar from "../component/NavbarSeller/NavbarSeller";
import Sidebar from "../component/SellerSidebar/SellerSidebar";
import { useSellerAuth } from "../context/SellerAuthContext";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import InventoryItem from "../component/InventoryItem/InventoryItem";
import Title from "../component/Title/Title";
import Footer from "../component/Footer/Footer";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn, authUser } = useSellerAuth();
  const userId = authUser.user_id;
   
  if (!isLoggedIn) {
    return <Navigate to="/sellerside"/>
  }
  const handleClick = () => {
    window.location.href = "/addproduct"
  };

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

      {products.length>0 ?<> <div className="wishlist-count">
      <Title title="Inventory"/>
            Total Products: {products.length > 0 ? products.length : 0}
          </div>
          <br/>
      <input
        type="text"
        placeholder="Search inventory..."
        value={searchQuery}
        className="searchWishlist"
        onChange={(e) => setSearchQuery(e.target.value)}
      /></>
     : null}
     <br /><br /><br />
      {products.length >0 ? (
        filteredProducts.map((item) => (
          <>
            <InventoryItem
              key={item.product_id}
              id={item.product_id}
              name={item.name}
              photo={item.photo_url}
              purchase_count={item.purchase_count}
              stock_quantity={item.stock_quantity}
              discount={item.discount}
            />
            <br />
          </>
        ))
      ) : (<div>

        <div className="inventory-empty">Your inventory is presently empty</div>
        <br />
        <br />
        <div className="wrap-for-button">
        <button className="a-buy-now-button" onClick={handleClick}> 
            Add Products
        </button>
        </div>
       
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default Inventory;
