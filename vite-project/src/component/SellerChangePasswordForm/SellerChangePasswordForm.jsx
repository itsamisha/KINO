import React, { useState } from "react";
import "../ChangePasswordForm/ChangePasswordForm.css";
import Title from "../Title/Title";
import Successful from "../Successful/Successful";
import Warning from "../Warning/Warning";
import Backdrop from "../Backdrop/Backdrop";
import { useSellerAuth } from "../../context/SellerAuthContext";

function SellerChangePasswordForm({ onCancel }) {
  const { authUser } = useSellerAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warning, setWarning] = useState(""); 

  const handleShowSuccess = () => {
    window.location.reload(); // Refresh the page after successful password change
  };

  const handleShowWarning = () => {
    setShowWarning(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      if (newPassword.length < 8) {
        setWarning("New password must be at least 8 characters long.");
        setShowWarning(true);
        return;
      }
      if (newPassword === confirmNewPassword) {
        const response = await fetch(
          "http://localhost:5000/customer/change-password",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: authUser.user_id,
              current_password: currentPassword,
              new_password: newPassword,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Reset form and show success message
        setShowSuccess(true);
      } else {
        setWarning("New password and confirm password do not match!");
        setShowWarning(true);
     
      }
    } catch (error) {
      console.error("Error changing password:", error.message);
      setWarning("Failed to change password. Please try again.");
      setShowWarning(true);
    }
  };

  return (
    <div className="customer-modal">
      <div className="customer-modal-content">
        <Title title="Change Password" />
        <br />
        <br />
        <br />
        <form onSubmit={handleSubmit}>
          <div className="info-row">
            <label className="info-label">Current Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="info-row">
            <label className="info-label">New Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="info-row">
            <label className="info-label">Confirm New Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="show-password-checkbox">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>
          <div className="button-container">
            <button type="submit" className="change-password-button">
              Change Password
            </button>
            <button
              type="button"
              className="change-password-button"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {showSuccess && (
        <>
          <Backdrop />
          <Successful
            message={`Password changed successfully!`}
            onClose={handleShowSuccess}
          />
        </>
      )}
       {showWarning && (
          <>
            <Backdrop />{" "}
            <Warning message={warning} onClose={handleShowWarning} />
          </>
        )}
    </div>
  );
}

export default SellerChangePasswordForm;

