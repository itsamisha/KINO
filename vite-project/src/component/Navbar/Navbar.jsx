import "./Navbar.css";
import logo from "../assets/logo_full_small.png";
import cartIcon from "../assets/cart_icon.png";
import { useState } from "react";
import Searchbar from "../Searchbar/Searchbar";
import { Link } from "react-router-dom";
import { useAuth } from "D:/NEW/vite-project/src/context/AuthContext.jsx";

const Navbar = () => {
  const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const [menu, setMenu] = useState("");
  const logOut = (e) => {
    e.preventDefault();
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
    window.location.href = "/";
    console.log(isLoggedIn);
  };

  return (
    <>
    <div className="nav-top">
        <ul>
            <li>Become a seller</li>
            <li>Gift Cards</li>
        </ul>
    </div>
    <div className="navbar">
      <div className="nav-logo">
        <Link to="/">
          <img className="logo-img" src={logo} alt="" />
        </Link>
      </div>

      <ul className="nav-menu">
        {/* <li onClick={()=>{setMenu("shop")}} className={menu === "shop"?'selected':''}><Link style={{textDecoration : 'none',color:'#000000'}} to="/">Home</Link></li>
                <li onClick={()=>{setMenu("electronics")}} className={menu === "electronics"?'selected':''}><Link style={{textDecoration : 'none',color:'#000000'}} to="/electronics">Electronics</Link></li>
                <li onClick={()=>{setMenu("fashion")}} className={menu === "fashion"?'selected':''}><Link style={{textDecoration : 'none',color:'#000000'}} to="/fashion">Fashion</Link></li>
                <li onClick={()=>{setMenu("lifestyle")}} className={menu === "lifestyle"?'selected':''}><Link style={{textDecoration : 'none',color:'#000000'}} to="/lifestyle">Lifestyle</Link></li> */}
        <Searchbar />
        <li className={isLoggedIn ? "username" : ""}>
        {isLoggedIn? ( <Link
            style={{ textDecoration: "none", color: "#000000" , width: "min-width"}}
            to="/customer"
          >
            <b className="line">{authUser.name}</b>
          </Link>) : (<Link
            style={{ textDecoration: "none", color: "#000000", width: "min-width" }}
            to="/signin"
          >
            <b className="line">{authUser.name}</b>
          </Link>) }
          
        </li>
        <div className="nav-login-cart">
          {isLoggedIn ? (
            <Link to="/signin">
              <button
                onClick={(e) => {
                  logOut(e);
                }}
              >
                Sign Out
              </button>
            </Link>
          ) : (
            <Link to="/signin">
              <button>Sign In</button>
            </Link>
          )}
          <Link to="/cart">
            <img className="cart-img" src={cartIcon} alt="" />
          </Link>
          <div className="nav-cart-count">0</div>
        </div>
      </ul>
    </div>
    </>
  );
};

export default Navbar;
