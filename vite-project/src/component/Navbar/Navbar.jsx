import "./Navbar.css";
import logo from "../assets/logo_full_small.png";
import cartIcon from "../assets/cart_icon.png";
import { useState } from "react";
import Searchbar from "../Searchbar/Searchbar";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSearch } from "../../context/SearchContext.jsx";

import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loading from "../Loading/Loading";

const Navbar = () => {
  const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const { updateSearchValue, updateSearchOption } = useSearch();
  const [loggingOut, setLoggingOut] = useState(false); 

  const logOut = async (e) => {
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
      setLoggingOut(true);
      updateSearchOption("product");
      updateSearchValue("");
      Navigate("/change");
    } catch (error) {
      console.error("Error during sign-out:", error);
    } finally {
      setLoggingOut(false); // Set loggingOut to false after sign-out logic is complete
    }
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
          <Searchbar />
          <li className={isLoggedIn ? "username" : ""}>
            {isLoggedIn ? (
              <Link
                style={{
                  textDecoration: "none",
                  color: "#000000",
                  width: "min-width",
                }}
                to="/customer"
              >
                <b className="line">{authUser.name}</b>
              </Link>
            ) : (
              <Link
                style={{
                  textDecoration: "none",
                  color: "#000000",
                  width: "min-width",
                }}
                to="/signin"
              >
                <b className="line">{authUser.name}</b>
              </Link>
            )}
          </li>
          <div className="nav-login-cart">
            {isLoggedIn ? (
              <Link to="/">
                {loggingOut ? (
                  <Loading /> 
                ) : (
                  <button
                    onClick={(e) => {
                      logOut(e);
                    }}
                  >
                    Sign Out
                  </button>
                )}
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
