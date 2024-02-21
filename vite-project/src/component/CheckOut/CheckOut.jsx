import React, { useState, useEffect } from "react";
import "./CheckOut.css";
import Receipt from "../Receipt/Receipt";
import { useAuth } from "../../context/AuthContext";
import AddressDetails from "../AddressDetails/AddressDetails";

const CheckOut = ({ onClose }) => {
  const { isLoggedIn, authUser } = useAuth();
  const userId = authUser.user_id;
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [postCode, setPostCode] = useState("");
  const [house, setHouse] = useState("");
  const [road, setRoad] = useState("");
  const [shippingCharge, setShippingCharge] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      getCartItems();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setTotalPrice(calculateTotalPrice(products));
  }, [products]);

  const getCartItems = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/customer/${userId}/cart`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const calculateTotalPrice = (cartProducts) => {
    let totalPrice = 0;
    cartProducts.forEach((product) => {
      const price = parseFloat(product.price);
      totalPrice += price * product.quantity;
    });
    return totalPrice;
  };

  const handlePostCodeChange = (value) => {
    setPostCode(value);
  };
  const handleHouseChange = (event) => {
    setHouse(event.target.value);
  };

  const handleRoadChange = (event) => {
    setRoad(event.target.value);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div className="check-container">
          <div className="receipt">
            {products.map((item) => (
              <Receipt
                key={item.product_id}
                id={item.product_id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
              />
            ))}
            <div className="check-total-container">
              <div className="check-T"></div>
              <div className="check-total">৳ {totalPrice.toFixed(2)}</div>
            </div>
            <div className="check-T">
              Shipping Charge:
              <div className="check-total">৳ {shippingCharge.toFixed(2)}</div>
            </div>
          </div>
          <div className="info-row">
            <label className="info-label">House No :</label>
            <input
              type="text"
              name="name"
              value={house}
              onChange={handleHouseChange}
              required
            />
          </div>
          <div className="info-row">
            <label className="info-label">Road No :</label>
            <input
              type="text"
              name="road"
              value={road}
              onChange={handleRoadChange}
              required
            />
          </div>
          <AddressDetails
            onPostCodeChange={handlePostCodeChange}
            fixShippingCharge={setShippingCharge}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
