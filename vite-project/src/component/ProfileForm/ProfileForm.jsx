import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import './ProfileForm.css'
import Title from "../Title/Title";

function ProfileForm({ onCancel}) {
  const { authUser, setAuthUser} = useAuth();
  const [name, setName] = useState(authUser.name);
  const [email, setEmail] = useState(authUser.email);
  const [phoneNumber, setPhoneNumber] = useState(authUser.phone_number);
  const [payment, setPayment] = useState(authUser.preferred_payment_method);
  const [showWarning, setShowWarning] = useState(false);
  const [warning, setWarning] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const userId = authUser.user_id;

  const validatePhoneNumber = (number) => {
    return /^\d{11}$/.test(number);
  };
  
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  

  const updateUserProfile = async () => {
    try {
      const userData = {
        name: name,
        email: email,
        phone_number: phoneNumber,
        preferred_payment_method: payment,
        user_id: userId
      };  
      const response = await fetch("http://localhost:5000/customer/update", {
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
      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update profile. Please try again.');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserProfile();
      setAuthUser(updatedUser);

    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile. Please try again.');
    }
  };


  return (
    <div className="customer-modal">
      <div className="customer-modal-content">
        <Title title="Edit Profile"/>
        <br /><br /><br />
        <form onSubmit={handleSubmit}>
          <div className="info-row">
            <label className="info-label">
              Name:
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
              Preferred Payment Method:
            </label>
            <select
                name="preferred_payment_method"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                required
              >
                <option value="">Select Payment Method</option>
                <option value="bKash">bKash</option>
                <option value="bank">bank payment</option>
                <option value="COD">Cash on delivery</option>
                
              </select>
          </div>
          <div className="button-container">
            <button type="submit" className="change-password-button">Save</button>
            <button type="button" className="change-password-button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileForm;
