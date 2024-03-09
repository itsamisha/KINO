import React, { useState } from "react";
import "../css/Registration.css";
import photo from "../component/assets/reg-photo.png";
import Header from "../component/Header/Header";
import Warning from "../component/Warning/Warning";
import Backdrop from "../component/Backdrop/Backdrop";
import Successful from "../component/Successful/Successful";
import Footer from "../component/Footer/Footer";
 
function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [show, setShow] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warning, setWarning] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleShowSucces = () => {
    window.location.href = "/signin"
  }

  const handleShowWarning = () => {
    setShowWarning(false);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmChange = (event) => {
    setConfirm(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const userType = "customer";

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    return /^\d{11}$/.test(phoneNumber);
  };

  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  const isFormValid = () => {
    if (!name || !email || !password || !confirm || !phoneNumber || !userType) {
      setWarning("Please complete all required fields.");
      setShowWarning(true);
      return false;
    }
    if (!isValidEmail(email)) {
      setWarning("Please enter a valid email address.");
      setShowWarning(true);
      return false;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setWarning("Please enter a valid phone number (11 digits).");
      setShowWarning(true);
      return false;
    }

    if (!isValidPassword(password)) {
      setWarning("Password must be at least 8 characters long.");
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

      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, phoneNumber, userType }),
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
      <Header />
      <br />
      <br />
      <div className="signInContainer">
        <img src={photo} className="woman" alt="" />
        <div className="reg-form">
          <h1 className="signin-h1">REGISTER</h1>
          <div className="flex-start">
            <label className="signin-label">Username*</label>
            <input
              className="signin-input"
              value={name}
              placeholder="Carla Ayala"
              onChange={(e) => handleNameChange(e)}
              type="text"
            ></input>
            <label className="signin-label">Email*</label>
            <input
              className="signin-input"
              value={email}
              placeholder="carla.ayala@gmail.com"
              onChange={(e) => handleEmailChange(e)}
              type="text"
            ></input>

            <label className="signin-label">Phone Number*</label>
            <input
              className="signin-input"
              value={phoneNumber}
              placeholder="01XXXXXXXXX"
              onChange={(e) => handlePhoneNumberChange(e)}
              type="text"
            ></input>

            <label className="signin-label">Password*</label>
            <input
              className="signin-input"
              value={password}
              placeholder="********"
              onChange={(e) => handlePasswordChange(e)}
              type={show ? "text" : "password"}
            ></input>

            <label className="signin-label">Confirm Password</label>
            <input
              className="signin-input"
              value={confirm}
              placeholder="********"
              onChange={(e) => handleConfirmChange(e)}
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
          <button onClick={(e) => handleRegister(e)} className="btn">
            Sign Up
          </button>{" "}
          <br />
          <div className="side-by-side">
            Already a member?&nbsp;
            <u
              onClick={() => (window.location.href = "/signin")}
              className="reg-text"
            >
              <b>Sign In</b>
            </u>
          </div>
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
      <Footer/>
    </>
  );
}

export default Registration;
