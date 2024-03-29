// import "./Navbar.css";
// import logo from "../assets/logo_full_small.png";
// import cartIcon from "../assets/cart_icon.png";
// import { useState } from "react";
// import Searchbar from "../Searchbar/Searchbar";
// import { Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext.jsx";
// import { useSearch } from "../../context/SearchContext.jsx";
// import Loading from "../Loading/Loading";
// import NotificationList from "../NotifList/NotifList.jsx";
// import { useEffect } from "react";
// import { IoIosNotifications } from "react-icons/io";

// const Navbar = () => {
//   const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
//   const { updateSearchValue, updateSearchOption } = useSearch();
//   const [loggingOut, setLoggingOut] = useState(false); 
//   const [cartItems, setCartItems] = useState(0);
//   const [showNotif,setShowNotif] = useState(false);
  
//   useEffect(() => {
//     async function getCartItems() {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/customer/${authUser.user_id}/cart_items`
//         );
//         const {cart_items} = await response.json();
//         if(cart_items>-1){
//           setCartItems(cart_items);
//         }

//       } catch (error) {
//         console.log(error.message);
//       }
//     }

//     if (isLoggedIn) {
//       getCartItems();
//     }
//   }, [isLoggedIn]);

//   const logOut = async (e) => {
//     e.preventDefault();
//     try {
//       setAuthUser({
//         user_id: "",
//         email: "",
//         password: "",
//         name: "Guest",
//         phone_number: "",
//         user_type: "",
//         registration_date: "",
//         preferred_payment_method: "",
//         cart_items: 0
//       });
//       setIsLoggedIn(false);
//       updateSearchOption("product");
//       updateSearchValue("");
//       setLoggingOut(true);
//       window.location.reload();
//     } catch (error) {
//       console.error("Error during sign-out:", error);
//     }
    
//   };

//   useEffect(() => {
//     if (loggingOut) {
//       const timeoutId = setTimeout(() => {
//       }, 0);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [loggingOut]);

//   return (
//     <>
//       <div className="nav-top">
//         <ul>
//         <Link style={{
//                   textDecoration: "none",
//                   color: "#000000",
//                   width: "min-width",
//                 }} to="/sellerside">
//         <li>Become a seller</li>
//               </Link>
//           <Link style={{
//                   textDecoration: "none",
//                   color: "#000000",
//                   width: "min-width",
//                 }} to="/gift-cards">
//           <li>Gift Cards</li>
//           </Link>
         
//         </ul>
//       </div>
//       <div className="navbar">
//         <div className="nav-logo">
//           <Link to="/">
//             <img className="logo-img" src={logo} alt="" />
//           </Link>
//         </div>

//         <ul className="nav-menu">
//           <Searchbar />
//           <li className={isLoggedIn ? "username" : ""}>
//             {isLoggedIn ? (
//               <Link
//                 style={{
//                   textDecoration: "none",
//                   color: "#000000",
//                   width: "min-width",
//                 }}
//                 to="/customer"
//               >
//                 <b className="user-label">{authUser.name}</b>
//               </Link>
//             ) : (
//               <Link
//                 style={{
//                   textDecoration: "none",
//                   color: "#000000",
//                   width: "min-width",
//                 }}
//                 to="/signin"
//               >
//                 <b className="user-label">Guest</b>
//               </Link>
//             )}
//           </li>
//           <div className="nav-login-cart">
//             {isLoggedIn ? (
//               <Link to="/">
//                 {loggingOut ? (
//                   <Loading /> 
//                 ) : (
//                   <button
//                     onClick={(e) => {
//                       logOut(e);``
//                     }}
//                   >
//                     Sign Out
//                   </button>
//                 )}
//               </Link>
//             ) : (
//               <Link to="/signin">
//                 <button>Sign In</button>
//               </Link>
//             )}
//             <Link to="/cart">
//               <img className="cart-img" src={cartIcon} alt="" />
//             </Link>
//             <div className="nav-cart-count">{cartItems}</div>
//           </div>
//         </ul>
//           {isLoggedIn && <NotificationList userId={authUser.user_id} />}
//       </div>
//       <div className="gradient-line"></div>
//     </>
//   );
// };

// export default Navbar;
import "./Navbar.css";
import logo from "../assets/logo_full_small.png";
import cartIcon from "../assets/cart_icon.png";
import { useState } from "react";
import Searchbar from "../Searchbar/Searchbar";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSearch } from "../../context/SearchContext.jsx";
import Loading from "../Loading/Loading";
import NotificationList from "../NotifList/NotifList.jsx";
import { useEffect } from "react";
import { IoIosNotifications } from "react-icons/io";

const Navbar = () => {
  const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
  const { updateSearchValue, updateSearchOption } = useSearch();
  const [loggingOut, setLoggingOut] = useState(false); 
  const [cartItems, setCartItems] = useState(0);
  const [showNotif, setShowNotif] = useState(false); // State to control visibility of notifications
  
  useEffect(() => {
    async function getCartItems() {
      try {
        const response = await fetch(
          `http://localhost:5000/customer/${authUser.user_id}/cart_items`
        );
        const {cart_items} = await response.json();
        if(cart_items > -1){
          setCartItems(cart_items);
        }

      } catch (error) {
        console.log(error.message);
      }
    }

    if (isLoggedIn) {
      getCartItems();
    }
  }, [isLoggedIn]);

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
        cart_items: 0
      });
      setIsLoggedIn(false);
      updateSearchOption("product");
      updateSearchValue("");
      setLoggingOut(true);
      window.location.reload();
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  useEffect(() => {
    if (loggingOut) {
      const timeoutId = setTimeout(() => {
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [loggingOut]);

  return (
    <>
      <div className="nav-top">
        <ul>
          <Link style={{
                    textDecoration: "none",
                    color: "#000000",
                    width: "min-width",
                  }} to="/sellerside">
            <li>Become a seller</li>
          </Link>
          <Link style={{
                    textDecoration: "none",
                    color: "#000000",
                    width: "min-width",
                  }} to="/gift-cards">
            <li>Gift Cards</li>
          </Link>
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
                <b className="user-label">{authUser.name}</b>
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
                <b className="user-label">Guest</b>
              </Link>
            )}
          </li>
          <div className="nav-login-cart">
          <Link to="/cart">
              <img className="cart-img" src={cartIcon} alt="" />
            </Link>
            <div className="nav-cart-count">{cartItems}</div>
            <li>
            <IoIosNotifications className="notif-bel" onClick={() => setShowNotif(!showNotif)} />
          </li>
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
            
          </div>
          
        </ul>
        {showNotif && isLoggedIn && <NotificationList userId={authUser.user_id} />}
      </div>
      <div className="gradient-line"></div>
    </>
  );
};

export default Navbar;
