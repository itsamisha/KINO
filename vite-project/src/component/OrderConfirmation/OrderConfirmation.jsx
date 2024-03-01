
import React from "react";
import "./OrderConfirmation.css"; // Style your warning component in a separate CSS file
import icon from "../assets/order_placed.png"; // Import the warning icon image
import Backdrop from "../Backdrop/Backdrop";

const OrderConfirmation = ({ message, onClose }) => {
  return (
    <>
    <Backdrop/>
      <div className="order-confirm-container">
        <img src={icon} alt="" className="order-confirm-icon" />
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </>
  );
};

export default OrderConfirmation;
