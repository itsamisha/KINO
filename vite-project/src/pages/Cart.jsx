import React, { useState, useEffect } from "react";
import "../css/Cart.css";
import Navbar from "../component/Navbar/Navbar";
import Sidebar from "../component/Sidebar/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import CartItem from "../component/CartItem/CartItem";
import Title from "../component/Title/Title";
import CheckOut from "../component/CheckOut/CheckOut";
import Loading from "../component/Loading/Loading"; // Import the loading component
import ContinueShopping from "../component/ContinueShopping/ContinueShopping";

const Cart = () => {
  const { isLoggedIn, authUser } = useAuth();
  const userId = authUser.user_id;
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to manage loading

  if(!isLoggedIn){
    window.location.href = '/signin'
  }
  useEffect(() => {
    if (isLoggedIn) {
      getCartItems();
    }
  }, [isLoggedIn]); 

  const getCartItems = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/customer/${userId}/cart`
      );
      const data = await response.json();
      setProducts(data);
      setIsLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.log(error.message);
      setIsLoading(false); // Set loading to false in case of error
    }
  };

  const calculateTotalPrice = (cartProducts) => {
    if (cartProducts.length > 0) {
      let totalPrice = 0;
      cartProducts.forEach((product) => {
        const price = parseFloat(product.price);
        totalPrice += price * product.quantity;
      });
      return totalPrice;
    }
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice(products));
  }, [products]);

  const filteredProducts = Array.isArray(products)
    ? products.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  return (
    <div className="container">
      {isLoading ? ( // Conditionally render loading component
        <Loading />
      ) : (
        <>
          {isLoggedIn ? <Navbar /> : null}
          {isLoggedIn ? <Sidebar /> : null}
          <br />
          <Title title="CART" />
          <br />
          {products.length > 0 ? (
          <div className="cart-count">
            Products Added: {products.length !== undefined ? products.length : 0}
          </div>) : <></> }
          {products.length > 0 ? (
            <>
            <br />
            <div className="confirm-order" onClick={handleCheckout}>
              PROCEED TO CHECKOUT
            </div>
            </>
          ) : (
            <></>
          )}
          {showCheckout && <><CheckOut onClose={handleCloseCheckout}/> <br />
          <br /></>}
          {products.length > 0 ? (
            <>
            <br />
            <br />

            <input
              type="text"
              placeholder="Search in cart..."
              value={searchQuery}
              className="searchCart"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          <br />
          <br />
          <br />
          </>
          ) : (
            <></>
          )}
          
          {isLoggedIn ? (
            products.length > 0 ? (
              filteredProducts.map((item) => (
                <React.Fragment key={item.product_id}>
                  <CartItem
                    id={item.product_id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    photo={item.photo_url}
                    stock_quantity={item.stock_quantity}
                  />
                  <br />
                </React.Fragment>
              ))
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

export default Cart;
