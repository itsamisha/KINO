// NotificationList.jsx

import React, { useState, useEffect } from 'react';
import Notification from "../Notifications/Notifications"; // Import the Notification component
import './NotifList.css'; // Import the CSS file for styling

function NotificationList({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications data from the server
    async function fetchNotifications() {
      try {
        const response = await fetch(`http://localhost:5000/notification/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
      }
    }

    fetchNotifications();
  }, [userId]);

  return (
    <div className="notification-list">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No Notifications</p>
      ) : (
        notifications.map((notification) => (
          <Notification key={notification.notification_id} message={notification.notification_text} notification_id={notification.notification_id} />
        ))
      )}
    </div>
  );
}

export default NotificationList;
