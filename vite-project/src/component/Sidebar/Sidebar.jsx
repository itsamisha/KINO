import React, { useState } from 'react';
import { FaHeart,FaShoppingCart, FaCommentAlt ,FaUser} from "react-icons/fa";
import './Sidebar.css';


// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const openNav = () => {
//     setIsOpen(true)
//   };

//   const closeNav = () => {
//     setIsOpen(false);
//   };

//   return (
//     <div>
//       <div
//         id="mySidebar"
//         className={`sidebar ${isOpen ? 'open' : ''}`}
//       >
//         <button
//           className="closebtn"
//           onClick={closeNav}
//         >
//           ×
//         </button>
//         <a href="/customer">Profile</a>
//         <a href="/orders">Orders</a>
//         <a href="/wishlist">Wishlist</a>
//         <a href="/reviews">Reviews</a>
//       </div>
//       <div
//         id="main"
//         className={`main ${isOpen ? 'open' : ''}`}
//       >
//         <button
//           className="openbtn"
//           onClick={openNav}
//         >
//           ☰ 
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


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
        <FaShoppingCart className="icon" />&nbsp;
          Orders
        </a>
        <a href="/wishlist">
          <FaHeart className="icon" />&nbsp;
          Wishlist
        </a>
        <a href="/reviews">
        <FaCommentAlt className="icon" />&nbsp;
          Reviews
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