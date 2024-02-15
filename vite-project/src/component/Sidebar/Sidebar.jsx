import React, { useState } from 'react';
import { FaHeart,FaShoppingCart, FaCommentAlt ,FaUser, FaHistory,FaGift} from "react-icons/fa";
import './Sidebar.css';
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
        <a href="/customer">
        <FaUser className="icon" />&nbsp;
          Profile
        </a>
        <a href="/orders">
        <FaHistory className="icon" />&nbsp;
          Orders
        </a>
        <a href="/cart">
        <FaShoppingCart className="icon" />&nbsp;
          Cart
        </a>
        <a href="/wishlist">
          <FaHeart className="icon" />&nbsp;
          Wishlist
        </a>
        <a href="/reviews">
        <FaCommentAlt className="icon" />&nbsp;
          Reviews
        </a>
        <a href="/giftcard">
        <FaGift className="icon" />&nbsp;
          Gift Card
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