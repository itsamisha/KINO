// SellerDashboard.js

// export default CustomerDashboard;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CustomerDashboard() {
  const [userInfo, setUserInfo] = useState("");
  const { user_id } = useParams();

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/seller-info/${user_id}`);
        const data = await response.json();

        console.log("Fetched data:", data);
        setUserInfo(data);
        console.log("Set user info:", userInfo);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchCustomerInfo();
  }, [user_id]);

  console.log("Rendered with user info:", userInfo);

  return (
    <div>
      <h2>Customer Dashboard</h2>
      {userInfo && (
        <div>
          <h3>Welcome!</h3>
          <p>Name: {userInfo.name}</p>
          <p>Email: {userInfo.email}</p>
          <p>Phone Number: {userInfo.phone_number}</p>
          <p>Payment Type: {userInfo.preferred_payment_method}</p>
          <p>Registration Date: {userInfo.registration_date}</p>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
