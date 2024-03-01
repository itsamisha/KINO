import Navbar from "../Navbar/Navbar";
import "./GiftCardPurchase.css";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Successful from "../Successful/Successful";
import Warning from "../Warning/Warning";
import Backdrop from "../Backdrop/Backdrop";

const giftCardDesigns = [
  "/src/component/assets/1.png",
  "/src/component/assets/2.png",
  "/src/component/assets/3.png",
  "/src/component/assets/4.png",
  "/src/component/assets/5.png",
  "/src/component/assets/6.png",
  "/src/component/assets/7.png",
  "/src/component/assets/8.png",
];

const defaultSelectedDesign = `/src/component/assets/${
  Math.floor(Math.random() * 8) + 1
}.png`;

const GiftCardPurchase = () => {
  const { isLoggedIn, authUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [phoneNumber, setPhoneNumber] = useState(authUser.phone_number);
  const [cardNumber, setCardNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warning, setWarning] = useState("");

  if (!isLoggedIn) {
    window.location.href = "/signin";
  }

  const [selectedDesign, setSelectedDesign] = useState(defaultSelectedDesign);

  const handlePaymentMethodChange = (event) => {
    const selectedPaymentMethod = event.target.value;
    setPaymentMethod(selectedPaymentMethod);
  };

  const handleDesignClick = (design) => {
    setSelectedDesign(design);
  };

  const handleShowSuccess = () => {
    window.location.href = "/gift-cards";
  };

  const handleShowWarning = () => {
    setShowWarning(false);
  };

  const validatePhoneNumber = () => {
    return phoneNumber.length === 11;
  };

  const validateCardNumber = () => {
    return cardNumber.length === 16;
  };

  const validateRecipientEmail = async () => {
    const response = await fetch(
      `http://localhost:5000/giftcard/valid_email/${email}`
    );
    const data = await response.json();
    if (data.user_id > -1) {
      return true;
    }
    return false;
  };

  const handleGiftCardPurchase = async () => {
    if (paymentMethod === "bkash" && !validatePhoneNumber()) {
      setWarning("Phone number must be 11 digits.");
      setShowWarning(true);
      return;
    }

    if (paymentMethod === "bank" && !validateCardNumber()) {
      setWarning("Card number must be 16 digits.");
      setShowWarning(true);
      return;
    }

    const isRecipientValid = await validateRecipientEmail();
    if (!isRecipientValid) {
      setWarning("Invalid recipient email.");
      setShowWarning(true);
      return;
    }
    const from_user_id = authUser.user_id;
    const to_email = email;
    const design = selectedDesign;
    console.log(`des ` + design);
    const response = await fetch("http://localhost:5000/giftcard/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, message, to_email, from_user_id, design }),
    });
    console.log(to_email);
    const data = await response.json();
    console.log(data);
    if (data.success) {
      setShowSuccess(true);
    } else {
      alert("Gift card wasn't purchased.");
    }
  };

  return (
    <div>
      <Navbar />
      {showWarning && (
        <div className="gc-warning-container">
          <Backdrop />
          <Warning message={warning} onClose={handleShowWarning} />
        </div>
      )}
      {showSuccess && (
        <div className="gc-warning-container">
          <Backdrop />{" "}
          <Successful
            message={`Gift card purchased successfully!`}
            onClose={handleShowSuccess}
          />
        </div>
      )}
      <label className="pick-one">Purchase Gift Card</label>
      <br /> <br />
      <div className="gcp-container">
        <div className="left-panel">
          <div className="popup">
            <img src={selectedDesign} alt="Selected Design" />
          </div>
        </div>
        <div className="right-panel">
          <label className="pick-one-small">Available Designs</label>
          <div className="gift-card-designs">
            {giftCardDesigns.map((design, index) => (
              <img
                key={index}
                src={design}
                alt={`Gift Card Design ${index + 1}`}
                onClick={() => handleDesignClick(design)}
              />
            ))}
          </div>
          <br />
          <br />
          <label className="signin-label">From</label>
          <br />
          <input
            className="signin-input"
            value={authUser.email}
            type="text"
            readOnly
          />
          <br />
          <label className="signin-label">To*</label>
          <br />
          <input
            className="signin-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="text"
            placeholder="carla.ayala@gmail.com"
            required
          />
          <br />
          <label className="signin-label">Your message*</label>
          <input
            className="signin-input"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            type="text"
            placeholder="Enter your message"
            required
          />
          <br />
          <label className="signin-label">Amount*</label>
          <br />
          <input
            className="signin-input"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            type="text"
            placeholder="500"
            required
          />
          <br />
          <br />
          <br />
          <div className="check-title">Payment Method:</div>
          <div className="c-info-row">
            <select
              className="gc-info-select"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <option value="bkash">bKash</option>
              <option value="bank">Bank Payment</option>
            </select>
          </div>
          {paymentMethod === "bkash" ? (
            <div>
              <label className="signin-label">Phone Number&nbsp;</label>
              <input
                className="signin-input"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          ) : paymentMethod === "bank" ? (
            <div>
              <label className="signin-label">Card Number:&nbsp;</label>
              <input
                className="signin-input"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>
          ) : null}
          <div className="purchase-now-button-wrap">
            <button
              className="purchase-now-button"
              onClick={handleGiftCardPurchase}
            >
              PURCHASE NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardPurchase;
