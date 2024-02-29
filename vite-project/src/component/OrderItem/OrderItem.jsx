import React from "react";
import PropTypes from "prop-types";
import ConfirmIcon from "../assets/confirm_icon.png";
import CancelIcon from "../assets/cancel_icon.png";

const OrderItem = ({ order }) => {
  const handleConfirmOrder = () => {
    // Logic to confirm order
    console.log("Order confirmed:", order.order_id);
  };

  const handleCancelOrder = () => {
    // Logic to cancel order
    console.log("Order cancelled:", order.order_id);
  };

  return (
    <div className="order-item">
      <div className="order-info">
        <p>Order ID: {order.order_id}</p>
        <p>Product Name: {order.name}</p>
        <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
        <p>Delivery Date: {new Date(order.estimated_delivery_date).toLocaleDateString()}</p>
      </div>
      <div className="order-actions">
        <img src={ConfirmIcon} alt="Confirm" onClick={handleConfirmOrder} />
        <img src={CancelIcon} alt="Cancel" onClick={handleCancelOrder} />
      </div>
    </div>
  );
};

OrderItem.propTypes = {
  order: PropTypes.shape({
    order_id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    order_date: PropTypes.string.isRequired,
    estimated_delivery_date: PropTypes.string.isRequired,
  }).isRequired,
};

export default OrderItem;
