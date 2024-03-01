import React from "react";
import "./Successful.css"; 
import warningIcon from "../assets/successful.png"; 

const Successful = ({ message, onClose }) => {
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

export default Successful;
