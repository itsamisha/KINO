import React, { useState, useEffect } from "react";
import Navbar from "../component/NavbarSeller/NavbarSeller";
import Sidebar from "../component/SellerSidebar/SellerSidebar";
import Title from "../component/Title/Title";
import "../css/SellerOrders.css";
import { useSellerAuth } from "../context/SellerAuthContext";
import OrderItem from "../component/OrderItem/OrderItem";
import Footer from "../component/Footer/Footer";

const Orders = () => {
  const [products, setProducts] = useState([]);
  const { authUser } = useSellerAuth();
  const user_id = authUser.user_id;
  const [selectedOption, setSelectedOption] = useState("pending");

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/seller/${user_id}/${selectedOption}/orders`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [user_id, selectedOption]);

  return (
    <div>
      <Navbar />
      <Sidebar />
      <Title title="ORDERS" />
      <div className="orders-tab">
        <button
          className={`orders-option ${
            selectedOption === "pending" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("pending")}
        >
          Pending
        </button>
        <button
          className={`orders-option ${
            selectedOption === "cancelled" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("cancelled")}
        >
          Cancelled
        </button>
        <button
          className={`orders-option ${
            selectedOption === "history" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("history")}
        >
          Confirmed
        </button>
      </div>
      <div className="orders-list">
      {Array.isArray(products) && products.map((order,index) => (
  <OrderItem key={index} order={order} />
))}

      </div>
      <Footer/>
    </div>
  );
};

export default Orders;
