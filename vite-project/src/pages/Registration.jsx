import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Registration.css";
//password
import hidden from "../component/assets/hidden.png";
import visible from "../component/assets/visible.png";
import hidden1 from "../component/assets/hidden.png";
import visible1 from "../component/assets/visible.png";
import regPhoto from "../component/assets/reg-photo.png"

function Registration() {
  const { navigate } = useNavigate();
  const userTypes = ["Customer", "Seller"];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [show, setShow] = useState(false);

  function handleShow() {
    setShow(!show);
  }
  const [confirmshow, setconfirmShow] = useState(false);

  function handleconfirmShow() {
    setconfirmShow(!confirmshow);
  }

  //onChange callback functions

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

  //Register Request

  const isFormValid = () => {
    if (!name || !email || !password || !confirm || !phoneNumber || !userType) {
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
        body: JSON.stringify({ email, password, name, phoneNumber, userType }),
      });

      const { success } = await response.json();
      if (success) {
        alert("Registration completed!\n Welcome to KINO");
        window.location.href = "/signin";
      } else {
        alert("Email already in use, please try again");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
        <div className="reg-container" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <div className="form">
          <h1 className="h1">REGISTER</h1>

          <br/>
          <label className="label">
            Username
            <br />
            <input className="reg-input" value={name} onChange={handleNameChange}/>
          </label >
          <br />
          <label className="label">
            Email
            <br />
            <input className="reg-input" value={email} onChange={handleEmailChange} />
          </label>
          <br />
          <label className="label">
            Password
            <br />
            <input className="reg-input"
            value={password}
            onChange={handlePasswordChange}
            placeholder="password"
            type={show? "text" : "password"}
            />
            <img src={show? visible:hidden} onClick={handleShow} className="eye"/>
          </label >
          <br />
          <label className="label">
      Confirm Password
      <br />
      <input
        className="reg-input"
        value={confirm}
        onChange={handleConfirmChange}
        placeholder="password"
        type={confirmshow ? "text" : "password"}
      />
      <img
        src={confirmshow ? visible : hidden}
        onClick={handleconfirmShow}
        className="confirmeye"
      />
    </label>

          <br />
          <label className="label">
            Phone Number
            <br />
            <input className="reg-input" value={phoneNumber} onChange={handlePhoneNumberChange}/>
          </label>
          <br />
          <button className="regbutton" onClick={(e) => handleRegister(e)}>Register</button>
        </div>
        ,<p className="pques">Already a member?</p>

        <button className={"signinbutton"}onClick={() => (window.location.href = "/signin")}>
          Sign In
        </button>
      </div>
  //   <>
  //   <div className="reg-container">
  //     <img src={regPhoto} className="woman" alt="" />
  //     <div className="reg-form">
  //     <div className="info-row">
  //           <p className="info-label">Name</p>
  //           <p className="info-value"></p>
  //         </div>
  //         <div className="info-row">
  //           <p className="info-label">Email</p>
  //           <p className="info-value"></p>
  //         </div>
  //         <div className="info-row">
  //           <p className="info-label">Phone Number</p>
  //           <p className="info-value"></p>
  //         </div>
  //         <div className="info-row">
  //           <p className="info-label">Preferred Payment Type</p>
  //           <p className="info-value">
  //          bye </p>
  //         </div>
  //         <div className="info-row">
  //           <p className="info-label">Member since</p>
  //           <p className="info-value">
  //             hi
  //           </p>
  //         </div>
  //         <button
  //           className="change-password-button"
  //         >
  //           Change Password
  //         </button>
  //     </div>
  //   </div>
  // </>
  );
}

export default Registration;
