import NavbarSeller from "../component/NavbarSeller/NavbarSeller";
import { useSellerAuth } from "../context/SellerAuthContext";
import "../css/SellerDashboard.css";
import { Navigate, useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { useState } from "react";
import SellerSidebar from "../component/SellerSidebar/SellerSidebar";

function SellerDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, authUser } = useSellerAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State variable for showing/hiding delete confirmation modal

  if (!isLoggedIn) {
    return <Navigate to="/signin" />;
  }

  function handleChangePassword() {
    navigate("/customer/change_password");
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-20${year}`;
  }

  function editProfile() {
    navigate("/customer/edit-profile");
  }

  // Function to handle opening the delete account modal
  function handleOpenDeleteModal() {
    setShowDeleteModal(true);
  }

  // Function to handle closing the delete account modal
  function handleCloseDeleteModal() {
    setShowDeleteModal(false);
  }

  // Function to handle deleting the account
  async function handleDeleteAccount() {
    try {
      const response = await fetch(`http://localhost:5000/delete-user/${authUser.user_id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        // Logout user after deleting account
        // Implement your logout functionality here
        navigate("/signin");
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error.message);
    }
  }

  return (
    <>
      <NavbarSeller />
      <SellerSidebar />
      <div className="customer-dashboard-container">
        <div className="user-info-parent">
          <h2 className="header">◧ PROFILE</h2>
          <FaUserEdit className="edit-icon" onClick={editProfile} />
        </div>

        <div className="customer-info">
          <div className="info-row">
            <p className="info-label">Name</p>
            <p className="info-value">{authUser.name}</p>
          </div>
          <div className="info-row">
            <p className="info-label">Email</p>
            <p className="info-value">{authUser.email}</p>
          </div>
          <div className="info-row">
            <p className="info-label">Phone Number</p>
            <p className="info-value">{authUser.phone_number}</p>
          </div>
          <div className="info-row">
            <p className="info-label">Preferred Payment Type</p>
            <p className="info-value">
              {authUser.preferred_payment_method
                ? authUser.preferred_payment_method
                : " ---"}
            </p>
          </div>
          <div className="info-row">
            <p className="info-label">Member since</p>
            <p className="info-value">
              {formatDate(authUser.registration_date)}
            </p>
          </div>
          <button
            onClick={handleChangePassword}
            className="change-password-button"
          >
            Change Password
          </button>
          <br />
          <br />
          <button
            onClick={handleOpenDeleteModal} // Open delete confirmation modal
            className="delete-account-button"
          >
            Delete Account
          </button>
          {/* Delete account confirmation modal */}
          {showDeleteModal && (
            <div className="delete-account-modal">
              <p>Are you sure you want to delete your account?</p>
              <button onClick={handleDeleteAccount}>Yes</button>
              <button onClick={handleCloseDeleteModal}>No</button>
            </div>
          )}
        </div>
      </div>
      <div className="space"></div>
    </>
  );
}

export default SellerDashboard;
