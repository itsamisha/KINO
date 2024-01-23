import React, { useState } from 'react';
import './DescriptionBox.css';

const DescriptionBox = ({description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-header" onClick={toggleDescription}>
        <span>{isExpanded ? '▼' : '►'}</span>
        <span className="descriptionbox-title">Description</span>
      </div>
      {isExpanded && (
        <div className="descriptionbox-content">
          {description}
        </div>
      )}
    </div>
  );
};

export default DescriptionBox;
