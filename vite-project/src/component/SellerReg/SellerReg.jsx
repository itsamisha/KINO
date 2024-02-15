import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SellerReg.css";
import hidden from "../assets/hidden.png";
import visible from "../assets/visible.png";
import hidden1 from "../assets/hidden.png";
import visible1 from "../assets/visible.png";
import regPhoto from "../assets/reg-photo.png";

function Registration() {
  const { navigate } = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankAccNo, setBankAccNo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const userType ="seller";
  const isFormValid = () => {
    if (!name || !email || !password || !confirm || !phoneNumber || !userType||!bankAccNo) {
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!isFormValid()) {
        alert("Fill up all the fields");
        return;
      }

      if (password !== confirm) {
        alert("Password and Confirm Password must match");
        setConfirm("");
        setPassword("");
        return;
      }

      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, phoneNumber, userType,bankAccNo }),
      });

      const { success } = await response.json();
      if (success) {
        alert("Registration completed!\n Welcome to KINO");
        window.location.href = "/seller";
      } else {
        alert("Email already in use, please try again");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="reg-box">
      <h1 className="h1">REGISTER</h1>
      <label className="label">
        Username
        <input className="reg-input" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="label">
        Email
        <input className="reg-input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="label">
        Bank Account Number
        <input className="reg-input" value={bankAccNo} onChange={(e) => setBankAccNo(e.target.value)} />
      </label>
      <label className="label">
  Password
  <div className="input-container">
    <input
      className="reg-input"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      type={showPassword ? "text" : "password"}
    />
    <img src={showPassword ? visible : hidden} onClick={handleTogglePassword} className="eye1" />
  </div>
</label>
<label className="label">
  Confirm Password
  <div className="input-container">
    <input
      className="reg-input"
      value={confirm}
      onChange={(e) => setConfirm(e.target.value)}
      type={showConfirmPassword ? "text" : "password"}
    />
    <img src={showConfirmPassword ? visible1 : hidden1} onClick={handleToggleConfirmPassword} className="eye2" />
  </div>
</label>

      <label className="label">
        Phone Number
        <input className="reg-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </label>
      <button className="regbutton" onClick={handleRegister}>Register</button>
      
    </div>
  );
}

export default Registration;
