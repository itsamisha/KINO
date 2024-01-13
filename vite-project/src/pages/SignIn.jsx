import React, { useState, useEffect } from "react";
import "../css/SignIn.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
//password
import hidden from '../component/assets/hidden.png'
import visible from '../component/assets/visible.png'

function SignIn() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, authUser, setAuthUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //password
  const [show,setShow] = useState(false)

  function handleShow(){
    setShow(!show)
  }

  function handleEmailUpdate(e) {
    setEmail(e.target.value);
  }

  function handlePasswordUpdate(e) {
    setPassword(e.target.value);
  }

  function fieldEmpty() {
    return !email || !password;
  }

  const handleSignIn = async (e) => {
    try {
      e.preventDefault();
      if (fieldEmpty()) {
        alert("Fill up all the fields");
        return;
      }
      const response = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const { success, userInfo } = await response.json();

      if (success) {
        setAuthUser(userInfo);
        setIsLoggedIn(true);
        console.log(isLoggedIn);
        alert(`Sign-in successful!\nWelcome back to KINO ${userInfo.name}`);
      } else {
        alert("Invalid email or password, please try again");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      alert(`Sign-in successful!\nWelcome back to KINO `);
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <>
    <div className="signInContainer">
      <div className="signin-form">
        <h1>SIGN IN</h1>
        <input
          className="signin-input"
          value={email}
          onChange={(e) => handleEmailUpdate(e)}
          placeholder="Email"
          type="email"
        ></input>
         <input
          className="signin-input"
          value={password}
          onChange={(e) => handlePasswordUpdate(e)}
          placeholder="Password"
          type={show? "text" : "password"}
        ></input>
        <img src={show? visible:hidden} onClick={handleShow} className="eye"/>
    
        <br />
        <br />
        <button onClick={(e) => handleSignIn(e)} className="btn">
          Sign In
        </button>{" "}
        <br />
          <p>
            Not a member?&nbsp;
            <u
              onClick={() => (window.location.href = "/register")}
              className="reg-text"
            ><b>
               Register
               </b>
            </u>
          </p>
      </div>
    </div>
    </>
  );
}

export default SignIn;

