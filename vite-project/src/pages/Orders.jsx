import React, { useState, useEffect } from "react";
import Navbar from "../component/Navbar/Navbar";
import Sidebar from "../component/Sidebar/Sidebar";
import Title from "../component/Title/Title";
import ContinueShopping from "../component/ContinueShopping/ContinueShopping";
import OrderHistoryItem from "../component/OrderHistoryItem/OrderHistoryItem";
import { useAuth } from "../context/AuthContext";
import "../css/Orders.css";
import Footer from "../component/Footer/Footer";

const Orders = () => {
  const [selectedOption, setSelectedOption] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn, authUser } = useAuth();
  const userId = authUser.user_id;

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const getOrders = async () => {
    try {
      const option = selectedOption;
      const userId = parseInt(authUser.user_id, 10);
      const requestBody = {
        user_id: userId,
        option: option
      };

      const response = await fetch("http://localhost:5000/customer/get-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getOrders();
    }
  }, [isLoggedIn, selectedOption]);

  const filteredOrders = orders.filter((order) =>
    order.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <Sidebar />
      <Title title="ORDERS" />

      <div className="orders-tab">
      <label
          className={`orders-option ${
            selectedOption === "pending" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("pending")}
        >
          Pending
        </label>
        <label
          className={`orders-option ${
            selectedOption === "to receive" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("to receive")}
        >
          To Receive
        </label>
        <label
          className={`orders-option ${
            selectedOption === "history" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("history")}
        >
          History
        </label>
        <label
          className={`orders-option ${
            selectedOption === "cancelled" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("cancelled")}
        >
          Cancelled
        </label>
      </div>
      {orders.length > 0 && (
        <>
        <br />
        <br />
         <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Orders..."
          className="searchWishlist"
        />
        <br />
        </>
       
      )}
      {filteredOrders.length > 0 ? (
        <div>
          <br />
          <br />
          {filteredOrders.map((item) => (
            <React.Fragment key={item.order_item_id}>
              <OrderHistoryItem
                name={item.name}
                price={item.price}
                photo={item.photo_url}
              />
              <br />
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div>
          <br />
          <br />
          <br />
          <br />
          <ContinueShopping />
        </div>
      )}
      <Footer/>
    </div>

  );
};

export default Orders;
