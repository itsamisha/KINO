import React, { useState } from 'react';
import './FilterMenu.css';

const FilterMenu = ({ categories }) => {
  const [priceRange, setPriceRange] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handlePriceChange = (e) => {
    setPriceRange(e.target.value);
    // Add logic to filter products by price
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    // Add logic to filter products by category
  };

  return (
    <div className="filter-menu">
      <div className="filter-section">
        <h3>Price</h3>
        <input 
          type="range" 
          min="0" 
          max="1000" 
          value={priceRange} 
          onChange={handlePriceChange} 
        />
        <p>Up to ${priceRange}</p>
      </div>
      <div className="filter-section">
        <h3>Category</h3>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Select a Category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterMenu;
