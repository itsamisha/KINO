import "../css/Wishlist.css";
import Navbar from "../component/Navbar/Navbar";
import Sidebar from "../component/Sidebar/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import WishlistItem from "../component/Wishlist-Item/WishlistItem";
import Title from "../component/Title/Title";
import React from "react";

const Wishlist = () => {
  const { isLoggedIn, authUser } = useAuth();
  const userId = authUser.user_id;
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    } catch (error) {
      console.log(error.message);
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
      <div className="wishlist-count">Products Added: {products.length}</div>
      <br />
      <input
        type="text"
        placeholder="Search wishlist..."
        value={searchQuery}
        className="searchWishlist"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <br />
      <br />
      <br />
      {isLoggedIn ? (
        products.length > 0 ? (
          filteredProducts.map((item) => (
            <React.Fragment key={item.product_id}>
              <WishlistItem
                id={item.product_id}
                name={item.name}
                discount={item.discount}
                photo={item.photo_url}
              />
              <br />
            </React.Fragment>
          ))
        ) : (
          <Link to="/">
            <h1>Wishlist empty</h1>
          </Link>
        )
      ) : (
        <Navigate to="/signin" />
      )}
    </div>
  );
};

export default Wishlist;
