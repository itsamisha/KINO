import React from "react";
import "./CheckOut.css";
import Receipt from "../Receipt/Receipt";
import { useAuth } from "../../context/AuthContext";
import { useState,useEffect } from "react";
const CheckOut = ({onClose }) => {
  const { isLoggedIn, authUser } = useAuth();
  const userId = authUser.user_id;
  const [products, setProducts] = useState([]);
  const [totalPrice,setTotalPrice] = useState(0);

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
      console.log(data);
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


  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div className="check-container">
          <div className="receipt">
            {products.map(item => (
              <React.Fragment key={item.product_id}>
                <Receipt
                    id = {item.product_id}
                    name =  {item.name}
                    price =  {item.price}
                    quantity = {item.quantity}
                />

              </React.Fragment>
            ))}
            <div className="check-total-container">
            <div className="check-T">Total Price: </div><div className="check-total">৳ {totalPrice.toFixed(2)}</div>
            </div>
          </div>
          <div className="payment-methods">
            <input
            type="text"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
