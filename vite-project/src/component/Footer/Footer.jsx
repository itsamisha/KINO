// // Footer.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import { FaFacebook, FaInstagram } from 'react-icons/fa'; // Import the icons
// import "./Footer.css"; // Add your styling here
// import Mascot from "../Mascot/Mascot";

// const Footer = () => {
//   return (
//     <div>
//                 <div className="gradient-line"></div>
//       <footer className="footer">

//         <div className="footer-links">
//           <ul>
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/about">About Us</Link>
//             </li>
//             <li>
//               <Link to="/contact">Contact</Link>
//             </li>
//           </ul>
//         </div>
//         <div className="footer-social-icons">
//           {/* Add Facebook and Instagram icons */}
//           <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
//             <FaFacebook className="social-icon" />
//           </a>
//           <a href="https://www.instagram.com/reel/C2SHivYojdP/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" rel="noopener noreferrer">
//             <FaInstagram className="social-icon" />
//           </a>
//         </div>
//         <div className="footer-info">
//           <p>&copy; 2024 KINO All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Footer;
// Footer.jsx
// Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa'; // Import additional icons
import "./Footer.css"; // Make sure to link your CSS file

const Footer = () => {
  return (
    <div>
      <div className="gradient-line"></div>
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-social-icons">
            {/* Social media icons */}
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="social-icon" />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="social-icon" />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="social-icon" />
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="social-icon" />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-links">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="footer-info">
            &copy; 2024 KINO All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

