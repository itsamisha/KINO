import React, { useState } from "react";
import { useSellerAuth } from "../../context/SellerAuthContext";
import '../ProfileForm/ProfileForm.css'
import './SellerProfileForm.css'
import Title from "../Title/Title";
import Successful from "../Successful/Successful";
import Backdrop from "../Backdrop/Backdrop"; 


function SellerProfileForm({ location, bankAcc,onCancel}) {
  const { authUser, setAuthUser} = useSellerAuth();
  const [name, setName] = useState(authUser.name);
  const [email, setEmail] = useState(authUser.email);
  const [phoneNumber, setPhoneNumber] = useState(authUser.phone_number);
  const [locations, setLocations] = useState(location)
  const [bank, setBank] = useState(bankAcc)
  const [showSuccess, setShowSuccess] = useState(false);

  const handleShowSucces = () => {
    window.location.reload();
  }
  
  const updateUserProfile = async () => {
    try {
      const userData = {
        name: name,
        email: email,
        phone_number: phoneNumber,
        locations: locations,
        bank_account_number: bank,
        user_id: authUser.user_id
      };  
      const response = await fetch("http://localhost:5000/seller/update", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const updatedUser = await response.json();
      console.log(updatedUser)
      return updatedUser;
    } catch (error) {
      console.log(error.message)
      throw new Error('Failed to update profile. Please try again.');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserProfile();
      setAuthUser(updatedUser);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile. Please try again.');
    }
  };


  return (
    <div className="seller-modal">
      <div className="seller-modal-content">
        <Title title="Edit Profile"/>
        <br /><br /><br />
        <form onSubmit={handleSubmit}>
          <div className="info-row">
            <label className="info-label">
              Shop Name:
            </label>
            <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
          </div>
          <div className="info-row">
            <label className="info-label">
              Email:
            </label>
            <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
          </div>
          <div className="info-row">
            <label className="info-label">
              Phone Number:
            </label>
            <input
                type="tel"
                name="phone_number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
          </div>
          <div className="info-row">
            <label className="info-label">
              Location:
            </label>
            <input
                type="text"
                name="locations"
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
                required
              />
          </div>
          <div className="info-row">
            <label className="info-label">
              Bank Account Number
            </label>
            <input
                type="text"
                name="bank"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                required
              />
          </div>
          <div className="button-container">
            <button type="submit" className="change-password-button">Save</button>
            <button type="button" className="change-password-button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      {showSuccess && (
          <>
            <Backdrop />{" "}
            <Successful message={`Account updated successfully!`} onClose={handleShowSucces} />
          </>
        )}
    </div>
  );
}

export default SellerProfileForm;
