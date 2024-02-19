import './NavbarSeller.css'
import logo from "../assets/logo_full_small.png";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSellerAuth } from "../../context/SellerAuthContext.jsx";

const NavbarSeller = () => {
  const navigate = useNavigate();
  const { isLoggedIn, authUser, setIsLoggedIn, setAuthUser } = useSellerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        registration_date: "",
        preferred_payment_method: "",
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
      alert("Fill up all the fields");
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
        alert(`Sign-in successful!\nWelcome back ${userInfo.name}`);
        navigate("/seller"); // Redirect to home page
      } else {
        alert("Invalid email or password, please try again");
      }
      
    } catch (error) {
      console.log(error.message);
    }
    
  };

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     // alert(`Sign-in successful!\nWelcome back ${authUser.name}`);
  //     navigate("/seller");
  //   }
  // }, [isLoggedIn, authUser, navigate]);

  return (
    <>
      <div className="navbar">
        <div className="nav-logo">
          <Link to="/">
            <img className="logo-img" src={logo} alt="logo" />
          </Link>
        </div>
        <ul className="nav-menu">
          <li>
            {isLoggedIn ? (
              <Link to="/seller" style={{ textDecoration: "none", color: "#000000" }}>
                <b>{authUser.name}</b>
                <button className='nav-login-cart button' onClick={handleLogout}>Logout</button>
              </Link>
            ) : (
              <form className='nav-input' onSubmit={handleLogin}>
                <input type="text" placeholder="Email or Phone" value={email} onChange={handleEmailUpdate} />
                <input type="password" placeholder="Password" value={password} onChange={handlePasswordUpdate} />
                <button type="submit">Login</button>
              </form>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default NavbarSeller;
