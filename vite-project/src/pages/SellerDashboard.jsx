import NavbarSeller from "../component/NavbarSeller/NavbarSeller";
import { useSellerAuth } from "../context/SellerAuthContext";
import "../css/SellerDashboard.css";
import { Navigate, useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import SellerSidebar from "../component/SellerSidebar/SellerSidebar";
import Title from "../component/Title/Title";
import SellerChangePasswordForm from "../component/SellerChangePasswordForm/SellerChangePasswordForm";
import SellerProfileForm from "../component/SellerProfileForm/SellerProfileForm"
import Footer from "../component/Footer/Footer";

function SellerDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, authUser } = useSellerAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [shop, setShop] = useState([]);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  if (!isLoggedIn) {
    return <Navigate to="/sellerside" />;
  }

  function handleChangePassword() {
    setShowChangePasswordForm(true);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-20${year}`;
  }

  useEffect(() => {
    if (isLoggedIn) {
      getInfo();
    }
  }, [isLoggedIn]);

  async function getInfo() {
    try {
      const response = await fetch(
        `http://localhost:5000/seller/${authUser.user_id}`
      );
      const data = await response.json();
      setShop(data);
      console.log(shop);
    } catch (error) {
      console.error(error.message);
    }
  }

  function editProfile() {
    setShowEditForm(true);
  }

  function handleOpenDeleteModal() {
    setShowDeleteModal(true);
  }

  function handleCloseDeleteModal() {
    setShowDeleteModal(false);
  }
  async function handleDeleteAccount() {
    try {
      const response = await fetch(
        `http://localhost:5000/delete-user/${authUser.user_id}`,
        {
          method: "DELETE",
        }
      );

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
      <Title title="PROFILE" />
      {showChangePasswordForm && (
        <SellerChangePasswordForm
          onCancel={() => setShowChangePasswordForm(false)}
        />
      )}
      {showEditForm && (
        <SellerProfileForm
          bankAcc = {shop && shop.length > 0 && shop[0].bank_account_number
            ? shop[0].bank_account_number
            : " ---"}
            location = {shop && shop.length > 0 && shop[0].locations
            ? shop[0].locations
            : " ---"}
          onCancel={() => setShowEditForm(false)}
        />
      )}
      <div className="customer-dashboard-container">
        <div className="edit-wrap">
          <FaUserEdit className="edit-icon" onClick={editProfile} />
        </div>
        <div className="customer-info">
          <div className="info-row">
            <p className="info-label">Shop Name</p>
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
            <p className="info-label">Location</p>
            <p className="info-value">
              {shop && shop.length > 0 && shop[0].locations
                ? shop[0].locations
                : " ---"}
            </p>
          </div>
          <div className="info-row">
            <p className="info-label">Bank Account Number</p>
            <p className="info-value">
              {shop && shop.length > 0 && shop[0].bank_account_number
                ? shop[0].bank_account_number
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
      <Footer/>
    </>
  );
}

export default SellerDashboard;
