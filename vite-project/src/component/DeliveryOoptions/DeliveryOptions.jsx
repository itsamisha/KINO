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
      <div className="checkbox-options">
        <label>
          <input 
            type="checkbox" 
            name="normal" 
            checked={selectedMode === 'normal'} 
            onChange={handleDeliveryModeChange} 
          />
          Normal Delivery
        </label>
        <label>
          <input 
            type="checkbox" 
            name="rapid" 
            checked={selectedMode === 'rapid'} 
            onChange={handleDeliveryModeChange} 
          />
          Rapid Delivery
        </label>
      </div>
    </div>
  );
};

export default DeliveryOptions;
