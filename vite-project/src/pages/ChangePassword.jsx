// import React, { useState } from 'react';
// import { useAuth } from "../context/AuthContext";
// import { Navigate, useNavigate } from "react-router-dom";
// import '../css/ChangePassword.css'

// function ChangePassword() {
//   const  navigate=useNavigate()
//     const { isLoggedIn, authUser, setAuthUser } = useAuth();
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//    const id=authUser.user_id;
//    const isValid = () => {
//     if (
      
//         !oldPassword ||
//         !newPassword 
      
//     ) {
//       return false;
//     }
//     return true;
//   };

//   const handleChangePassword = async () => {
//     try {
//         if (!isValid()) {
//             alert("Fill up all the fields");
//             return;
//           }
//       const response = await fetch("http://localhost:5000/customer/change_password", {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           id,
//           oldPassword,
//           newPassword,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       setSuccessMessage(data.message);
//       setError(null);

//     //   setAuthUser((prevAuthUser) => ({
//     //     ...prevAuthUser,
//     //     password: newPassword,
//     //   }));
//     //   console.log(authUser.password)
//     alert('Password Changed!');
//       navigate("/customer")
//     } catch (error) {
//       console.error('Error changing password:', error.message);
//       setError('Failed to change password. Please try again.');
//       setSuccessMessage(null);
//     }
//   };

//   return (
//     <div className="ChangePasswordContainer">
//       <h2 className="ChangePasswordHeader">Change Password</h2>
//       {error && <div style={{ color: 'red' }}>{error}</div>}
//       {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
//       <div className="ChangePasswordLabel">
//         <label htmlFor="oldPassword">Old Password:</label>
//         <input
//           type="password"
//           id="oldPassword"
//           value={oldPassword}
//           onChange={(e) => setOldPassword(e.target.value)}
//         />
//       </div>
//       <div>
//         <p></p>
//         <label htmlFor="newPassword">New Password:</label>
//         <input
//           type="password"
//           id="newPassword"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//         />
//       </div>
//       <p></p>
//       <button className="ChangePasswordButton" onClick={handleChangePassword}>Change Password</button>
//     </div>
//   );
// }

// export default ChangePassword;
