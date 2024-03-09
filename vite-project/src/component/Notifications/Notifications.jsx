import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Import FaTimes icon
import './Notifications.css'; // Import the CSS file for styling

function Notification({ message, notification_id }) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/delete-notif/${notification_id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
      window.location.reload();
      // Optionally, you can handle UI updates here after successful deletion
    } catch (error) {
      console.error('Error deleting notification:', error.message);
      // Optionally, you can show an error message or handle retries
    }
  };

  return (
    <div className="notification">
      <p>{message}</p>
      <button className="delete-btn" onClick={handleDelete}>
        <FaTimes />
      </button>
    </div>
  );
}

export default Notification;
