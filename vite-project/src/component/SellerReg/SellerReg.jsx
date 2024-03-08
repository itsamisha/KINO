import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SellerReg.css";
import regPhoto from "../assets/SellerRegistration.png";
import Warning from "../Warning/Warning";
import Successful from "../Successful/Successful";
import Backdrop from "../Backdrop/Backdrop";

function Registration() {
  const { navigate } = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [bankAccNo, setBankAccNo] = useState("");
  const [show, setShow] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warning, setWarning] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const userType = "seller";

  const handleShowSucces = () => {
    window.location.reload();
  }

  const handleShowWarning = () => {
    setShowWarning(false);
  };

  const validatePhoneNumber = (number) => {
    return /^\d{11}$/.test(number);
  };
  
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  
  const validateBankAccountNumber = (accountNumber) => {
    return /^\d{10}$/.test(accountNumber);
  }
  const isFormValid = () => {
    if (
      !name ||
      !email ||
      !password ||
      !confirm ||
      !phoneNumber ||
      !userType ||
      !bankAccNo
    ) {
      setWarning("Please complete all required fields.");
      setShowWarning(true);
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!isFormValid()) {
        return;
      }

      if (password !== confirm) {
        setWarning("Passwords must match!");
        setShowWarning(true);
        setConfirm("");
        setPassword("");
        return;
      }

      if (!validateEmail(email)) {
        setWarning("Please enter a valid email address.");
        setShowWarning(true);
        return;
      }

      if (!validatePhoneNumber(phoneNumber)) {
        setWarning("Please enter a valid phone number (11 digits).");
      setShowWarning(true);
        return;
      }
    
      if (!validateBankAccountNumber(bankAccNo)) {
        setWarning("Please enter a valid bank account number (10 digits).");
      setShowWarning(true);
        return;
      }

      if (password.length < 8) {
        setWarning("Password must be at least 8 characters long.");
        setShowWarning(true);
        return;
      }
    

      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          phoneNumber,
          userType,
          bankAccNo,
        }),
      });

      const { success } = await response.json();
      if (success) {
        setShowSuccess(true);
      } else {
        setWarning("Email already in use, please try again");
        setShowWarning(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="signInContainer">
        <img src={regPhoto} className="seller-woman" alt="" />
        <div className="reg-form">
          <h1 className="seller-signin-h1-first">REGISTER</h1>
          <h1 className="seller-signin-h1">AS SELLER</h1>
          <div className="flex-start">
            <label className="signin-label">Username*</label>
            <input
              className="signin-input"
              value={name}
              placeholder="Timex"
              onChange={(e) => setName(e.target.value)}
              type="text"
            ></input>
            <label className="signin-label">Email*</label>
            <input
              className="signin-input"
              placeholder="timex@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
            ></input>

            <label className="signin-label">Phone Number*</label>
            <input
              className="signin-input"
              placeholder="01XXXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              type="text"
            ></input>

            <label className="signin-label">Bank Account Number*</label>
            <input
              className="signin-input"
              placeholder="XXXXXXXXXX"
              value={bankAccNo}
              onChange={(e) => setBankAccNo(e.target.value)}
            ></input>

          <label className="signin-label">Location</label>
            <input
              className="signin-input"
              placeholder="Dhanmondi,Dhaka"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              type="text"
            ></input>

            <label className="signin-label">Password*</label>
            <input
              className="signin-input"
              value={password}
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
              type={show ? "text" : "password"}
            ></input>

            <label className="signin-label">Confirm Password</label>
            <input
              className="signin-input"
              value={confirm}
              placeholder="********"
              onChange={(e) => setConfirm(e.target.value)}
              type={show ? "text" : "password"}
            ></input>
            <div className="label-wrap">
              <label>
                <input
                  type="checkbox"
                  checked={show}
                  onChange={() => setShow(!show)}
                />
                Show passwords
              </label>
            </div>
          </div>
          <br />
          <br />
          <button className="btn" onClick={handleRegister}>
          Sign Up
          </button>
        </div>
        {showWarning && (
          <>
            <Backdrop />{" "}
            <Warning message={warning} onClose={handleShowWarning} />
          </>
        )}
        {showSuccess && (
          <>
            <Backdrop />{" "}
            <Successful message={`Account created successfully!\nWelcome to KINO`} onClose={handleShowSucces} />
          </>
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default Registration;
