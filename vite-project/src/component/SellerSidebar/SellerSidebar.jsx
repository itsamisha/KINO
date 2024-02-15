import React, { useState } from 'react';
import { FaHeart,FaShoppingCart, FaCommentAlt ,FaUser} from "react-icons/fa";
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
        className={`sidebar ${isOpen ? 'open' : ''}`}
      >
        <button
          className="closebtn"
          onClick={closeNav}
        >
          ×
        </button>
        <a href="/seller">
        <FaUser className="icon" />&nbsp;
          Profile
        </a>
        <a href="/sellerorders">
        <FaShoppingCart className="icon" />&nbsp;
          Orders
        </a>
        <a href="/addproduct">
          <FaHeart className="icon" />&nbsp;
         Add Products
        </a>
        <a href="/sellerreviews">
        <FaCommentAlt className="icon" />&nbsp;
          Reviews And Reply
        </a>
      </div>
      <div
        id="main"
        className={`main ${isOpen ? 'open' : ''}`}
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