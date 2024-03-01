import React, { useState, useEffect } from "react";
import "../css/Wishlist.css";
import Navbar from "../component/Navbar/Navbar";
import Sidebar from "../component/Sidebar/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import WishlistItem from "../component/Wishlist-Item/WishlistItem";
import Title from "../component/Title/Title";
import Loading from "../component/Loading/Loading"; // Import the loading component
import ContinueShopping from "../component/ContinueShopping/ContinueShopping";

const Wishlist = () => {
  const { isLoggedIn, authUser } = useAuth();
  const userId = authUser.user_id; 
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true); // State to manage loading

  if(!isLoggedIn){
    window.location.href = '/signin'
  }
  useEffect(() => {
    if (isLoggedIn) {
      getWishlist();
    }
  }, [isLoggedIn]);

  const getWishlist = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/customer/${userId}/wishlist`
      );
      const data = await response.json();
      setProducts(data);
      setIsLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.log(error.message);
      setIsLoading(false); // Set loading to false in case of error
    }
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="container">
      {isLoggedIn ? <Navbar /> : null}
      {isLoggedIn ? <Sidebar /> : null}
      <br />
      <Title title="WISHLIST" />
      <br />
      {isLoading ? ( 
        <Loading />
      ) : (
        <>
          
          {products.length > 0 ? (
            <>
            <div className="wishlist-count">
            Products Added: {products.length > 0 ? products.length : 0}
          </div>
          <br />
            <input
              type="text"
              placeholder="Search wishlist..."
              value={searchQuery}
              className="searchWishlist"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            </>
          ) : null}
          
          {isLoggedIn ? (
            products.length > 0 ? (
              <>
              <br />
              <br />
              <br />
              {filteredProducts.map((item) => (
                <React.Fragment key={item.product_id}>
                  <WishlistItem
                    id={item.product_id}
                    name={item.name}
                    discount={item.discount}
                    photo={item.photo_url}
                    in_cart={item.in_cart}
                  />
                  <br />
                </React.Fragment>
              ))}
              </>
             
            ) : (
                <ContinueShopping/> 
            )
          ) : (
            <Navigate to="/signin" />
          )}
        </>
      )}
    </div>
  );
};

export default Wishlist;
