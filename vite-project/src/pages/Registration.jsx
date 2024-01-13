import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function Registration() {
  const {navigate} = useNavigate()
  const userTypes = ["Customer", "Seller"]
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("") 
  const [phoneNumber, setPhoneNumber] = useState("")
  const [userType,setUserType] = useState("")

  //onChange callback functions

  const handleNameChange = (event) => {
    setName(event.target.value)
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  };

  const handleConfirmChange = (event) => {
    setConfirm(event.target.value)
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value)
  };

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value)
  }; 
  
  //Register Request 

  const isFormValid = () => {
  if (
    !name ||
    !email ||
    !password ||
    !confirm ||
    !phoneNumber ||
    !userType 
  ) {
    return false;
  }
  return true;
};
  
   const handleRegister= async (e) => {
    e.preventDefault()
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
        window.location.href = "/signin"
      } else {
        alert("Email already in use, please try again");
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="reg-container" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
    <div className="form">
      <h1>REGISTER</h1>
      <label>
        Usertype
        {userTypes.map((user) => (
        <label key={user}>
          <input
            type="radio"
            value={user.toLowerCase()}
            name="userType"
            onChange={handleUserTypeChange}
          />
          {user}
        </label>
      ))}
      </label>
      <br/>
      <label>
        Username
        <br />
        <input className="reg-input" value={name} onChange={handleNameChange}/>
      </label>
      <br />
      <label>
        Email
        <br />
        <input className="reg-input" value={email} onChange={handleEmailChange} />
      </label>
      <br />
      <label>
        Password
        <br />
        <input className="reg-input" value={password} type="password" onChange={handlePasswordChange}/>
      </label>
      <br />
      <label>
        Confirm Password
        <br />
        <input value={confirm} type="password" onChange={handleConfirmChange}/>
      </label>
      <br />
      <label>
        Phone Number
        <br />
        <input className="reg-input" value={phoneNumber} onChange={handlePhoneNumberChange}/>
      </label>
      <br />
      <button onClick={(e) => handleRegister(e)}>Register</button>
    </div>
    Already a member?
    <button onClick={() => (window.location.href = "/signin")}>
      Sign In
    </button>
  </div>
  );
}

export default Registration;
