// import React, { useState, useEffect } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import "./FilterMenu.css";

// const FilterMenu = ({ onFilterChange }) => {
//   const [priceRange, setPriceRange] = useState({ min: "", max: "" });
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [categories, setCategories] = useState([]);

//   const location = useLocation();
//   const params = useParams();
//   const getCategories = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/category`);
//       const data = await response.json();

//       console.log(data);
//       setCategories(data.categories);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   useEffect(() => {
//     getCategories();
//   }, []);

//   const handleCategoryChange = (e) => {
//     onFilterChange("category", e.target.value);
//   };

//   const handlePriceChange = (minOrMax) => (e) => {
//     const newPriceRange = { ...priceRange, [minOrMax]: e.target.value };
//     onFilterChange("priceRange", newPriceRange);
//   };

//   useEffect(() => {
//     // Trigger the update of the search results when filters change
//     const handleFilterChange = () => {
//       onFilterChange(priceRange, selectedCategory);
//     };

//     handleFilterChange();
//   }, [priceRange, selectedCategory, onFilterChange]);

//   return (
//     <div className="filter-menu">
//       <div className="filter-section">
//         <h4>Price</h4>
//         <input
//           type="number"
//           placeholder="Min price"
//           value={priceRange.min}
//           onChange={handlePriceChange("min")}
//         />
//         <input
//           type="number"
//           placeholder="Max price"
//           value={priceRange.max}
//           onChange={handlePriceChange("max")}
//         />
//       </div>
//       <div className="filter-section">
//         <h3>Category</h3>
//         <select value={selectedCategory} onChange={handleCategoryChange}>
//           <option value="">All</option>
//           {categories.map((category) => (
//             <option key={category} value={category}>
//               {category}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default FilterMenu;
import { useState } from "react";

const FilterMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className='filter-menu'>
    <div className="filter" onClick={toggleDescription}>
      <span>{isExpanded ? '▼' : '►'}</span>
      <span className="filter">Filter Results</span>
    </div>
    {isExpanded && (
      <div className="filter-section">
        <div className="price-range">
          Price Range
          <input type="number" placeholder="Minimum Price"/>
          <input type="number" placeholder="Maximum Price"/>
        </div>      
        <div className="category">
          Category
        </div>
        <div className="sort">
          Sort
        </div>
      </div>
    )}
   </div>
  )
}

export default FilterMenu
