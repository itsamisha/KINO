// Header.jsx
import React from "react";
import Logo from "../assets/logo_full_small.png"; 
import "./Header.css"; 

const Header = () => {
  return (
    <div className="header-wrap">
    <div className="header">
      <div className="logo-container">
      <a href="/">
      <img src={Logo} alt="Logo" className="logo" />
            </a>
      </div>
      <div className="slogan">
        <h1>Discover the Best Deals, Prices & Discounts</h1>
      </div>
    </div>
    <div className="new-gradient-line-footer"></div>
    </div>
  );
};

export default Header;
