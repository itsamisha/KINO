import React from "react";
import PropTypes from "prop-types";
import { FaCheck, FaTimes } from "react-icons/fa";

const OrderItem = ({ order }) => {
  const handleConfirmOrder = async () => {
    try {
      // Call API to confirm the order
      const response = await fetch(`http://localhost:5000/seller/confirm-order/${order.order_id}/${order.product_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Order confirmed:", order.order_id);
        // Refresh the page after order confirmation
        window.location.reload();
      } else {
        console.error("Failed to confirm order:", response.statusText);
      }
    } catch (error) {
      console.error("Error confirming order:", error.message);
    }
  };

  const handleCancelOrder = async () => {
    try {
      // Call API to cancel the order
      const response = await fetch(`http://localhost:5000/seller/cancel-order/${order.order_id}/${order.product_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Order cancelled:", order.order_id);
        // Refresh the page after order cancellation
        window.location.reload();
      } else {
        console.error("Failed to cancel order:", response.statusText);
      }
    } catch (error) {
      console.error("Error cancelling order:", error.message);
    }
  };

  return (
    <div className='wishlist-container'>
      <div className="order-info">
        <p>Order ID: {order.order_id}</p>
        <p>Product Name: {order.name}</p>
        <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
        <p>Delivery Date: {new Date(order.estimated_delivery_date).toLocaleDateString()}</p>
      </div>
      <div className="order-actions">
        {/* Render FaCheck icon if order_status is neither 'confirmed' nor 'cancelled' */}
        {order.order_status !== 'confirmed' && order.order_status !== 'cancelled' && order.order_status !== 'to receive' && (
          <FaCheck onClick={handleConfirmOrder} />
        )}
        
        {/* Render FaTimes icon if order_status is 'pending' */}
        {order.order_status === 'pending' && (
          <FaTimes onClick={handleCancelOrder} />
        )}
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
    order_status: PropTypes.string.isRequired, 
  }).isRequired,
};

export default OrderItem;
