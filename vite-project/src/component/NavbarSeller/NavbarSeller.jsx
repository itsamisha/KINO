import './NavbarSeller.css'
import logo from "../assets/logo_full_small.png";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSellerAuth } from "../../context/SellerAuthContext.jsx";
import Warning from "../Warning/Warning.jsx"
import Backdrop from '../Backdrop/Backdrop.jsx';
const NavbarSeller = () => {
  const navigate = useNavigate();
  const { isLoggedIn, authUser, setIsLoggedIn, setAuthUser } = useSellerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      setAuthUser({
        user_id: "",
        email: "",
        password: "",
        name: "Guest",
        phone_number: "",
        user_type: "",
        registration_date: ""
      });
      setIsLoggedIn(false);
      //setLoggingOut(true);
      navigate('/sellerside');
    } catch (error) {
      console.error("Error during sign-out:", error);
    } finally {
      //setLoggingOut(false); 
    }
    
  };

  function handleEmailUpdate(e) {
    setEmail(e.target.value);
  }

  function handlePasswordUpdate(e) {
    setPassword(e.target.value);
  }

  function fieldEmpty() {
    return !email || !password;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (fieldEmpty()) {
      setWarningMessage("Fill up all the fields");
      setShowWarning(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const { success, userInfo } = await response.json();

      if (success) {
        setAuthUser(userInfo);
        setIsLoggedIn(true);
        console.log(userInfo);
        navigate("/seller");
      } else {
        setWarningMessage("Invalid email or password, please try again");
        setShowWarning(true);
      }
      
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
          
      <div className="seller-navbar">
        <div className="seller-nav-logo">
          <Link to="/">
            <img className="seller-logo-img" src={logo} alt="logo" />
          </Link>
        </div>
        <ul className="seller-nav-menu">
          <li  className={isLoggedIn ? "username" : ""}>
            {isLoggedIn ? (
              <>
              <Link to="/seller" style={{ textDecoration: "none", color: "#000000" ,
              width: "max-width",}}>
                <b className="user-label">{authUser.name}</b>
                </Link>
                <button className='change-password-button ' onClick={handleLogout}>Logout</button>
              </>
              
            ) : (
              <form className='nav-input-seller' onSubmit={handleLogin}>
                <input className='seller-signin-input' type="text" placeholder="Email" value={email} onChange={handleEmailUpdate} />
                <input className='seller-signin-input' type="password" placeholder="Password" value={password} onChange={handlePasswordUpdate} />
                <button className='change-password-button' type="submit">Login</button>
              </form>
            )}
          </li>
        </ul>
      </div>
      <div className="line"></div>
      {showWarning && <><Warning message={warningMessage} onClose={() => setShowWarning(false)} /></>}
    </>
  );
};

export default NavbarSeller;
