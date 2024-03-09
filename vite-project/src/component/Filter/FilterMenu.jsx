// // import { useState } from "react";

// // const FilterMenu = () => {
// //   const [isExpanded, setIsExpanded] = useState(false);

// //   const toggleDescription = () => {
// //     setIsExpanded(!isExpanded);
// //   };
// //   return (
// //     <div className='filter-menu'>
// //     <div className="filter" onClick={toggleDescription}>
// //       <span>{isExpanded ? '▼' : '►'}</span>
// //       <span className="filter">Filter Results</span>
// //     </div>
// //     {isExpanded && (
// //       <div className="filter-section">
// //         <div className="price-range">
// //           Price Range
// //           <input type="number" placeholder="Minimum Price"/>
// //           <input type="number" placeholder="Maximum Price"/>
// //         </div>      
// //         <div className="category">
// //           Category
// //         </div>
// //         <div className="sort">
// //           Sort
// //         </div>
// //       </div>
// //     )}
// //    </div>
// //   )
// // }

// // export default FilterMenu
// import React, { useState } from "react";

// const FilterMenu = ({ onFilterChange, onSortChange }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedSortBy, setSelectedSortBy] = useState("");

//   const toggleDescription = () => {
//     setIsExpanded(!isExpanded);
//   };

//   const handleMinPriceChange = (e) => {
//     setMinPrice(e.target.value);
//   };

//   const handleMaxPriceChange = (e) => {
//     setMaxPrice(e.target.value);
//   };

//   const handleCategoryChange = (e) => {
//     setSelectedCategory(e.target.value);
//   };

//   const handleSortChange = (e) => {
//     setSelectedSortBy(e.target.value);
//   };

//   const handleApplyFilters = () => {
//     // Pass the selected filter options to the parent component
//     onFilterChange({ minPrice, maxPrice, selectedCategory });
//     onSortChange(selectedSortBy);
//   };

//   return (
//     <div className="filter-menu">
//       <div className="filter" onClick={toggleDescription}>
//         <span>{isExpanded ? "▼" : "►"}</span>
//         <span className="filter">Filter Results</span>
//       </div>
//       {isExpanded && (
//         <div className="filter-section">
//           <div className="price-range">
//             <label htmlFor="minPrice">Minimum Price:</label>
//             <input
//               type="number"
//               id="minPrice"
//               value={minPrice}
//               onChange={handleMinPriceChange}
//               placeholder="Minimum Price"
//             />
//             <label htmlFor="maxPrice">Maximum Price:</label>
//             <input
//               type="number"
//               id="maxPrice"
//               value={maxPrice}
//               onChange={handleMaxPriceChange}
//               placeholder="Maximum Price"
//             />
//           </div>
//           <div className="category">
//             <label htmlFor="category">Category:</label>
//             <select
//               id="category"
//               value={selectedCategory}
//               onChange={handleCategoryChange}
//             >
//               <option value="">All Categories</option>
//               {/* Add options dynamically based on available categories */}
//             </select>
//           </div>
//           <div className="sort">
//             <label htmlFor="sortBy">Sort By:</label>
//             <select
//               id="sortBy"
//               value={selectedSortBy}
//               onChange={handleSortChange}
//             >
//               <option value="">Select Sorting Option</option>
//               <option value="price-low-to-high">Price: Low to High</option>
//               <option value="price-high-to-low">Price: High to Low</option>
//               {/* Add more sorting options as needed */}
//             </select>
//           </div>
//           <button onClick={handleApplyFilters}>Apply Filters</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FilterMenu;

import React, { useState } from "react";
import './FilterMenu.css'

const FilterMenu = ({ onFilterChange, onSortChange }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSortBy, setSelectedSortBy] = useState("");

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSelectedSortBy(e.target.value);
  };

  const handleApplyFilters = () => {
    // Pass the selected filter options to the parent component
    onFilterChange({ minPrice, maxPrice, selectedCategory });
    onSortChange(selectedSortBy);
  };

  return (
    <div className="filter-menu">
      <div className="filter-section">
        <div className="price-range">
          <label htmlFor="minPrice">Minimum Price:</label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="Minimum Price"
          />
          <label htmlFor="maxPrice">Maximum Price:</label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="Maximum Price"
          />
        </div>
        <div className="category">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {/* Add options dynamically based on available categories */}
          </select>
        </div>
        <div className="sort">
          <label htmlFor="sortBy">Sort By:</label>
          <select
            id="sortBy"
            value={selectedSortBy}
            onChange={handleSortChange}
          >
            <option value="">Select Sorting Option</option>
            <option value="price-low-to-high">Price: Low to High</option>
            <option value="price-high-to-low">Price: High to Low</option>
            {/* Add more sorting options as needed */}
          </select>
        </div>
        <button onClick={handleApplyFilters}>Apply Filters</button>
      </div>
    </div>
  );
};

export default FilterMenu;
