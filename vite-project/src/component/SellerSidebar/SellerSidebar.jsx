import React, { useState } from 'react';
import { FaHeart,FaShoppingCart, FaCommentAlt ,FaUser, FaBitcoin, FaClipboardList, FaPaste} from "react-icons/fa";
import './SellerSidebar.css';


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openNav = () => {
    setIsOpen(true);
  };

  const closeNav = () => { 
    setIsOpen(false);
  };

  return (
    <div>
      <div
        id="mySidebar"
        className={`seller-sidebar ${isOpen ? 'open' : ''}`}
      >
        <button
          className="seller-closebtn"
          onClick={closeNav}
        >
          ×
        </button>
        <a href="/seller">
        <FaUser className="seller-icon" />&nbsp;
          Profile
        </a>
        <a href="/sellerorders">
        <FaShoppingCart className="seller-icon" />&nbsp;
          Orders
        </a>
        <a href="/addproduct">
          <FaPaste
          className="seller-icon" />&nbsp;
         Add Products
        </a>
        <a href="/inventory">
          <FaClipboardList  className="icon" />&nbsp;
         Inventory
        </a>
        <a href="/sellerreviews">
        <FaCommentAlt className="seller-icon" />&nbsp;
          Reviews And Reply
        </a>
        <a href="/analytics">
          <FaBitcoin className="icon" />&nbsp;
         Analytics
        </a>
      </div>
      <div
        id="main"
        className={`seller-main ${isOpen ? 'open' : ''}`}
      >
        <button
          className="openbtn"
          onClick={openNav}
        >
          ☰ 
        </button>
        
      </div>
    </div>
  );
};

export default Sidebar;