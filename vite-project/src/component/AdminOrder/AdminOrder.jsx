import React, { useState, useEffect } from "react";

import Title from "../Title/Title";
import "./AdminOrder.css";

import OrderItem from "../OrderItem/OrderItem";

const Orders = () => {
  const [products, setProducts] = useState([]);
 

  const [selectedOption, setSelectedOption] = useState("pending");

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/admin/${selectedOption}/orders`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [ selectedOption]);

  return (
    <div>
     
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
            selectedOption === "On the Way" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("to receive")}
        >
          On the Way
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
            selectedOption === "confirmed" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("confirmed")}
        >
          Confirmed
        </button>
      </div>
      <div className="orders-list">
      {Array.isArray(products) && products.map((order,index) => (
  <OrderItem key={index} order={order} />
))}

      </div>
    </div>
  );
};

export default Orders;
