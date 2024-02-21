import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import './ProfileForm.css'
import Title from "../Title/Title";

function ProfileForm({ onCancel}) {
  const { authUser, setAuthUser} = useAuth();
  const [formData, setFormData] = useState({
    name: authUser.name,
    email: authUser.email,
    phone_number: authUser.phone_number,
    preferred_payment_method: authUser.preferred_payment_method || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  // };

  const updateUserProfile = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/customer/update", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
      await updateUserProfile(formData);
      setAuthUser((prevAuthUser) => ({
        ...prevAuthUser,
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        preferred_payment_method: formData.preferred_payment_method,
      }));
      alert('Profile updated successfully!');
      setFormData({
        name: authUser.name,
        email: authUser.email,
        phone_number: authUser.phone_number,
        preferred_payment_method: authUser.preferred_payment_method || "",
      });
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile. Please try again.');
    }
  };


  return (
    <div className="modal">
      <div className="modal-content">
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
                value={formData.name}
                onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
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
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
          </div>
          <div className="info-row">
            <label className="info-label">
              Preferred Payment Method:
            </label>
            <select
                name="preferred_payment_method"
                value={formData.preferred_payment_method}
                onChange={handleChange}
              >
                <option value="">Select Payment Method</option>
                <option value="bKash">bKash</option>
                <option value="COD">Cash on delivery</option>
                {/* Add other payment methods as necessary */}
              </select>
          </div>
          {/* Add other fields as necessary */}
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
