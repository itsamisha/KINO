import React from 'react';
import { useAuth } from "../context/AuthContext";

const SellerDashboard = () => {
  const { authUser } = useAuth();

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <p>Welcome back, {authUser.name}</p>
      <h2>Your Inventory</h2>
      {/* <ul>
        {authUser.inventory.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default SellerDashboard;
