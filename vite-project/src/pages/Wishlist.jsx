import "../css/Wishlist.css";
import Navbar from "../component/Navbar/Navbar";
import Sidebar from "../component/Sidebar/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import WishlistItem from "../component/Wishlist-Item/WishlistItem";
const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn, authUser } = useAuth();
  const userId = authUser.user_id;
  
  if (!isLoggedIn) {
    return <Navigate to="/signin"/>
  }
  
  const getWishlist = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/customer/${userId}/wishlist`
      );
      const data = await response.json();
      console.log(data);
      setProducts(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getWishlist();
  }, []);

  const filteredProducts = Array.isArray(products)
  ? products.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];
  

  return (
    <div className="container">
      <Navbar />
      <Sidebar />
      <h2 className="header">◧ WISHLIST</h2>
      <input
        type="text"
        placeholder="Search wishlist..."
        value={searchQuery}
        className="searchWishlist"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <br /><br /><br />
      {products.length > 0 ? (
        filteredProducts.map((item) => (
          <>
            <WishlistItem
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

export default Wishlist;
