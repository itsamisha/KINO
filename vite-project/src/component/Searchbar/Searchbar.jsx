import "./Searchbar.css";
import search from "../assets/search.png";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Searchbar = () => {
  const [searchOption, setSearchOption] = useState("product");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    // Perform the search based on the selected option and query
    
    navigate(`/search-results?search=${encodeURIComponent(searchQuery)}&option=${encodeURIComponent(searchOption)}`);
    console.log(`Searching for ${searchQuery} in ${searchOption}`);
    

  
    // Assuming you want to navigate to '/search-results'
  
    // Add your logic to perform the actual search
  };
  
  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <div className="custom-dropdown">
          <select className="search-options" id="search-options" 
          onChange={handleSearchOptionChange}
          value={searchOption} >
            <option value="product" className="option">
              Product
            </option>
            <option value="category">Category</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <input type="text" placeholder="Search" className="search-input" 
        onChange={handleSearchInputChange}
        value={searchQuery}/>
        <button className="search-button" onClick={handleSearch}
        >
          <img src={search} />
        </button>
      </div>
    </div>
  );
};

export default Searchbar;
