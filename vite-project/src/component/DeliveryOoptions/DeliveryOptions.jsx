import React, { useState } from 'react';
import './DeliveryOptions.css';

const DeliveryOptions = ({ onSelectDeliveryMode }) => {
  const [selectedMode, setSelectedMode] = useState('');

  const handleDeliveryModeChange = (event) => {
    const { name } = event.target;
    setSelectedMode(name);
    onSelectDeliveryMode(name);
  };

  return (
    <div className="delivery-options">
      <div className="del-checkbox-options">
        <div className="del-option">
          <input 
            type="checkbox" 
            name="normal" 
            checked={selectedMode === 'normal'} 
            onChange={handleDeliveryModeChange} 
          />
          <label htmlFor="normal">Standard Delivery (3 - 4 days)</label>
        </div>
        <div className="del-option">
          <input 
            type="checkbox" 
            name="rapid" 
            checked={selectedMode === 'rapid'} 
            onChange={handleDeliveryModeChange} 
          />
          <label htmlFor="rapid">Rapid Delivery (1 day)</label>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOptions;

