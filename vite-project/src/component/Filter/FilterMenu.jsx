import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './FilterMenu.css';
import Item from '../Item/Item'

const FilterMenu = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);


  const location = useLocation();
  const params = useParams();
  const getCategories=async()=>{
    try{
      const response = await fetch(`http://localhost:5000/category`);
      const data = await response.json();
      

      console.log(data);
      setCategories(data.categories);
    }catch(error)
    {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getCategories()
  },[]);

 

  const handleCategoryChange = (e) => {
    onFilterChange('category', e.target.value);
  };

  const handlePriceChange = (minOrMax) => (e) => {
    const newPriceRange = { ...priceRange, [minOrMax]: e.target.value };
    onFilterChange('priceRange', newPriceRange);
  };

  useEffect(() => {
    // Trigger the update of the search results when filters change
    onFilterChange(priceRange, selectedCategory);
  }, [priceRange, selectedCategory, onFilterChange]);

  // const handlePriceChange = (minOrMax) => (e) => {
  //   setPriceRange(prevRange => ({ ...prevRange, [minOrMax]: e.target.value }));
  // };

  return (
    <div className="filter-menu">
      <div className="filter-section">
        <h3>Price</h3>
        <input 
          type="number" 
          placeholder="Min price" 
          value={priceRange.min} 
          onChange={handlePriceChange('min')} 
        />
        <input 
          type="number" 
          placeholder="Max price" 
          value={priceRange.max} 
          onChange={handlePriceChange('max')} 
        />
        <p>Price: ${priceRange.min} - ${priceRange.max}</p>
      </div>
      <div className="filter-section">
        <h3>Category</h3>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Select a Category</option>
          {categories.map(category => (
  <option key={category} value={category}>
    {category}
  </option>
))}
        </select>
      </div>
    </div>
  );
};

export default FilterMenu;
