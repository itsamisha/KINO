import React, { useState } from "react";
import Navbar from "../component/Navbar/Navbar";
import Sidebar from "../component/Sidebar/Sidebar";
import Title from "../component/Title/Title";
import "../css/Orders.css";

const Orders = () => {

  const [selectedOption, setSelectedOption] = useState("Pending");

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <Navbar />
      <Sidebar />
      <Title title="ORDERS" />
      <div className="orders-tab">
        <label
          className={`orders-option ${
            selectedOption === "Pending" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("Pending")}
        >
          Pending
        </label>
        <label
          className={`orders-option ${
            selectedOption === "History" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("History")}
        >
          History
        </label>
        <label
          className={`orders-option ${
            selectedOption === "Cancelled" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("Cancelled")}
        >
          Cancelled
        </label>
      </div>
    </div>
  );
};

export default Orders;
