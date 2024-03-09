import Navbar from "../component/Navbar/Navbar";
import { useAuth } from "../context/AuthContext";
import "../css/CustomerDashboard.css";
import { Navigate, useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { useState } from "react";
import Sidebar from "../component/Sidebar/Sidebar";
import ChangePasswordForm from "../component/ChangePasswordForm/ChangePasswordForm";
import Title from "../component/Title/Title";
import ProfileForm from "../component/ProfileForm/ProfileForm";

function CustomerDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, authUser } = useAuth();
  console.log(isLoggedIn);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  if (!isLoggedIn) {
    return <Navigate to="/signin" />;
  }

  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-20${year}`;
  }

  function editProfile() {
    //navigate("/customer/edit-profile");
    setShowEditForm(true);
  }

  function handleChangePassword() {
    setShowChangePasswordForm(true); 
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <Title title="PROFILE" />
      {showChangePasswordForm && (
        <ChangePasswordForm onCancel={() => setShowChangePasswordForm(false)} /> 
      )}
      {showEditForm && (
        <ProfileForm
          authUser={authUser}
          onCancel={() => setShowEditForm(false)}
        />
      )}
      <div className="customer-dashboard-container">
        <div className="edit-wrap">
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
              {authUser.preferred_payment_method === "COD"
                ? "Cash On Delivery"
                : authUser.preferred_payment_method === "bank"
                ? "Bank Payment"
                : authUser.preferred_payment_method === "bkash"
                ? "bKash"
                : authUser.preferred_payment_method || "---"}
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
        </div>
      </div>
      <div className="space"></div>
    </>
  );
}

export default CustomerDashboard;
