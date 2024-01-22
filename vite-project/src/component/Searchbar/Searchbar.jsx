import "./Searchbar.css";
import search from "../assets/search.png";
import React from "react";
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';

const Searchbar = () => {
  const { searchValue, updateSearchValue, searchOption, updateSearchOption } = useSearch();
  const navigate = useNavigate();

  const handleSearchOptionChange = (event) => {
    const option = event.target.value;
    updateSearchOption(option);
  };

  const handleSearchInputChange = (event) => {
    updateSearchValue(event.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    navigate(`/search-results?search=${encodeURIComponent(searchValue)}&option=${encodeURIComponent(searchOption)}`);
    console.log(`Searching for ${searchValue} in ${searchOption}`);
  };
  
  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <div className="custom-dropdown">
          <select className="search-options" id="search-options" 
            onChange={handleSearchOptionChange}
            value={searchOption}>
            <option value="product" className="option">
              Product
            </option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <input type="text" placeholder="Search" className="search-input" 
          onChange={handleSearchInputChange}
          value={searchValue}
          onKeyDown={(e) => e.key === 'Enter' && handleKeyPress(e)} />
        <button className="search-button" onClick={handleSearch}>
          <img src={search} alt="Search" />
        </button>
      </div>
    </div>
  );
};

export default Searchbar;
