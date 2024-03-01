import React, { useState, useEffect } from "react";
import "./CheckOut.css";
import Receipt from "../Receipt/Receipt";
import { useAuth } from "../../context/AuthContext";
import AddressDetails from "../AddressDetails/AddressDetails";
import DeliveryOptions from "../DeliveryOoptions/DeliveryOptions";
import Warning from "../Warning/Warning";
import OrderConfirmation from "../OrderConfirmation/OrderConfirmation";

const CheckOut = ({ onClose }) => {

  const { isLoggedIn, authUser } = useAuth();
  console.log(authUser.phone_number)
  const userId = authUser.user_id;
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [postCode, setPostCode] = useState("");
  const [house, setHouse] = useState("");
  const [road, setRoad] = useState("");
  const [shippingCharge, setShippingCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [phoneNumber, setPhoneNumber] = useState(authUser.phone_number);
  const [cardNumber, setCardNumber] = useState("");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState("");
  const [giftCardApplied, setGiftCardApplied] = useState(false);
  const [giftCardAmount, setGiftCardAmount] = useState(totalPrice - total);
  const [rapid, setRapid] = useState(0);
  const [prevTotalPrice,setPrevTotalPrice] = useState(total);
  const [showWarning, setShowWarning] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  

  useEffect(() => {
    if (isLoggedIn) {
      getCartItems();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setTotalPrice(calculateTotalPrice(products));
  }, [products]);

  useEffect(() => {
    setGiftCardCode("");
    setGiftCardApplied(false)
  }, [postCode, totalPrice, rapid]);

  useEffect(() => {
    setGiftCardAmount(totalPrice+rapid+shippingCharge - total); 
  }, [postCode, totalPrice, rapid,total]);


  useEffect(()=>
  {
    if(total<totalPrice){
      setGiftCardApplied(true)
    }
    if(total===0){
      setPaymentMethod("COD")
    }

  },[total])
  useEffect(() => {
    if (selectedDeliveryMode === "rapid") {
      setRapid(100);
    }
    if (selectedDeliveryMode === "normal") {
      setRapid(0);
    }
  }, [selectedDeliveryMode]);

  useEffect(() => {
    setTotal(totalPrice + shippingCharge + rapid);
  }, [totalPrice, shippingCharge, rapid]);

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

  const handlePaymentWithGiftCard = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/customer/${authUser.user_id}/${giftCardCode}/${totalPrice+shippingCharge+rapid}`
      );
      const { new_total_price } = await response.json();

      if (new_total_price > -1) {
        setPrevTotalPrice(total);
        setTotal(new_total_price);
        setGiftCardApplied(true);
      }
      else{
        setGiftCardApplied(false);
        setTotal(prevTotalPrice+rapid+shippingCharge);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const validateForm = () => {

    if (paymentMethod === "bank" && cardNumber.length < 16) {
      setWarningMessage('Invalid Card Number')
      return false;
    }
    // Check if phone number is at least 11 digits
    if (paymentMethod === "bkash" && phoneNumber.length < 11) {
      setWarningMessage('Invalid Phone Number')
      return false;
    }
    // Check if all required fields are filled
    if (!house || !road || !postCode || !selectedDeliveryMode) {
      setWarningMessage('Please fill out all the mandatory fields')
      return false;
    }
    return true;
  };


  const handleConfirmOrder = async () => {
    // setOrderConfirmed(true)
    if (validateForm()) {
      if(giftCardApplied){
        try {
          const response = await fetch(
            `http://localhost:5000/customer/use_gift_card/${authUser.user_id}/${giftCardCode}/${totalPrice+shippingCharge+rapid}`
          );
          const { new_total_price } = await response.json();
    
          if (new_total_price > -1) {
            setPrevTotalPrice(total);
            setTotal(new_total_price);
            setGiftCardApplied(true);
          }
          else{
            setGiftCardApplied(false);
            setTotal(prevTotalPrice+rapid+shippingCharge);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
      const user_id = authUser.user_id;
      const post_code = postCode
      const phone_no = phoneNumber

      let day = 1;
      if(selectedDeliveryMode==="normal"){
          day = 4;
      }
      if(phoneNumber){
        const response = await fetch("http://localhost:5000/customer/confirm_order_mobile_banking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({user_id,house, road, post_code,day,phone_no }),
        });
        
        const data = await response.json();
        if (data.success) {
          setOrderConfirmed(true)

        } else {
          alert("Order wasn't placed.");
        }
      } 
      
    } else {
      setShowWarning(true); // Show warning if form validation fails
    }
  }; 

  const handleShowOrderConfirm = () => {
    window.location.href = "/";
  }
  const handleShowWarning = () => {
    setShowWarning(false);
  }
  const handleSelectDeliveryMode = (mode) => {
    setSelectedDeliveryMode(mode);
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

  const handlePaymentMethodChange = (event) => {
    const selectedPaymentMethod = event.target.value;
    if(total!==0){
      setPaymentMethod(selectedPaymentMethod);
     setPhoneNumber("");
     setCardNumber("");
    }
    
  };

  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div className="check-container">
          <div className="address-container">
            <div className="check-title">Address:</div>
            <div className="c-info-row">
              <label className="c-info-label">House No :</label>
              <input
                className="c-info-input"
                type="text"
                name="name"
                value={house}
                onChange={handleHouseChange}
                required
              />
            </div>
            <div className="c-info-row">
              <label className="c-info-label">Road No&nbsp;&nbsp;&nbsp;:</label>
              <input
                className="c-info-input"
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
            <div className="gift-card-container">
              <div className="check-title">Gift Card:</div>
              <div className="c-info-row">
                <label className="c-info-label">Gift Card Code:</label>
                <input
                placeholder="XXXXXXXXXXXX"
                  className="c-info-input"
                  type="text"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value)}
                />
              </div>
              {giftCardApplied && <div className="check-notice">Gift Card Applied -{`${giftCardAmount.toFixed(2)}`}</div>}
              <div className="redeem-wrap">
              <button className="redeem" onClick={handlePaymentWithGiftCard}>Redeem</button>
              </div>
            </div>
          </div>
          <div className="vertical-gap"></div>
          <div className="payment-container">
          <div className="check-title">Payment Method:</div>
          <div className="c-info-row">
            <select className="c-info-select" value={paymentMethod} onChange={handlePaymentMethodChange}>
              <option value="bkash">bKash</option>
              <option value="bank">Bank Payment</option>
              <option value="COD">Cash on Delivery</option>
            </select>
          </div>
          {paymentMethod === "bkash" ? (
            <div className="c-info-row">
              <label className="c-info-label">Phone Number:&nbsp;</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          ) : paymentMethod === "bank" ? (
            <div className="c-info-row">
              <label className="c-info-label">Card Number:&nbsp;</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>
          ) : null}
          <br /><br />
          <div className="check-title">Delivery Options:</div>
          <DeliveryOptions onSelectDeliveryMode={handleSelectDeliveryMode} />
          </div>
          <div className="vertical-gap"></div>
          <div className="receipt">
            <div className="check-title">Order Summary:</div>
            <div id="order-summary-scrollbar" className="scroll">
              {products.map((item) => (
                <Receipt
                  key={item.product_id}
                  id={item.product_id}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                />
              ))}
            </div>
            <div className="check-total-container">
              <div className="check-T">Item Total:</div>
              <div className="check-total">
                ৳{parseFloat(totalPrice).toFixed(2)}
              </div>
            </div>
            <div className="check-total-container">
              <div className="check-T">Shipping Charge:</div>
              <div className="check-total">
                ৳{parseFloat(shippingCharge + rapid).toFixed(2)}
              </div>
            </div>
            <hr className="horizontal-line" />
            <div className="check-total-container">
              <div className="check-T">Total:</div>
              <div className="check-total">৳{parseFloat(total).toFixed(2)}</div>
            </div>
          </div>
         
          {showWarning && <Warning message={warningMessage} onClose={handleShowWarning}/>}
          {orderConfirmed && <OrderConfirmation onClose={handleShowOrderConfirm}/>}

        </div>
        <button onClick={handleConfirmOrder}>Confirm</button>
      </div>
    </div>
  );
};

export default CheckOut;
