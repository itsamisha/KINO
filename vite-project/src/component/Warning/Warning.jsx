// Warning.js
import React from "react";
import "./Warning.css"; // Style your warning component in a separate CSS file
import warningIcon from "../assets/warning.png"; // Import the warning icon image
import Backdrop from "../Backdrop/Backdrop"; // Import the Backdrop component

const Warning = ({ message, onClose }) => {
  return (
    <>
      <div className="warning-container">
        <img src={warningIcon} alt="Warning" className="warning-icon" />
        <p className="warning-message">{message}</p>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </>
  );
};

export default Warning;
