import React from "react";
import "./CheckOut.css"; 
const CheckOut = ({ totalPrice, onClose }) => {
  return (
    <div className="checkout-box">
      <h2>Checkout</h2>
      <div className="checkout-details">
        <p>Total Price: ৳ {totalPrice}</p>
        {/* Add more checkout details here */}
      </div>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default CheckOut;
