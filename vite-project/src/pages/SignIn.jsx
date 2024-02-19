import React, { useState, useEffect } from "react";
import "../css/SignIn.css";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";
import photo from "../component/assets/SignIn.png";
import Header from "../component/Header/Header";

function SignIn() {
  const {updateSearchValue,updateSearchOption } = useSearch();
  updateSearchOption('product')
  updateSearchValue('')
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, setAuthUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    <Header/>
      <div className="signInContainer">
        <img src={photo} className="woman" alt="" />
        <div className="signin-form">
          <h1>SIGN IN</h1>
          <div className="flex-start">
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
              type={showPassword ? "text" : "password"}
            ></input>
            <div className="label-wrap">
              <label>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                Show password
              </label>
            </div>
          </div>
          <br />
          <br />
          <button onClick={(e) => handleSignIn(e)} className="btn">
            Sign In
          </button>{" "}
          <br />
          <div className="side-by-side">
            Not a member?&nbsp;
            <u
              onClick={() => (window.location.href = "/register")}
              className="reg-text"
            >
              <b>Register</b>
            </u>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
