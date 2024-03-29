// import React, { useState, useEffect } from 'react';
// import './SearchResults.css';
// import Item from '../Item/Item';
// import Navbar from '../Navbar/Navbar';
// import Loading from '../Loading/Loading';
// import { useLocation } from 'react-router-dom';
// import Title from '../Title/Title';

// const SearchResults = () => {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchCount, setSearchCount] = useState(0);
//   const [filterOptions, setFilterOptions] = useState({
//     category: '',
//     minPrice: '',
//     maxPrice: '',
//     sortBy: ''
//   });

//   const location = useLocation();

//   useEffect(() => {
//     const fetchResults = async (filters) => {
//       setLoading(true);

//       try {
//         const response = await fetch(
//           `http://localhost:5000/search?search=${encodeURIComponent(filters.searchQuery)}&option=${encodeURIComponent(filters.searchOption)}&category=${encodeURIComponent(filters.category)}&minPrice=${encodeURIComponent(filters.minPrice)}&maxPrice=${encodeURIComponent(filters.maxPrice)}&sortBy=${encodeURIComponent(filters.sortBy)}`
//         );

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         setResults(data.results);
//         setSearchCount(data.results.length);
//       } catch (error) {
//         console.error('Error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (location.search) {
//       // Parse query parameters and fetch results
//       const queryParams = new URLSearchParams(location.search);
//       const searchQuery = queryParams.get('search');
//       const searchOption = queryParams.get('option');

//       const filters = {
//         searchQuery,
//         searchOption,
//         category: filterOptions.category,
//         minPrice: filterOptions.minPrice,
//         maxPrice: filterOptions.maxPrice,
//         sortBy: filterOptions.sortBy
//       };

//       fetchResults(filters);
//     }
//   }, [location, filterOptions]);

//   const handleMinPriceChange = (minPrice) => {
//     setFilterOptions({ ...filterOptions, minPrice });
//   };

//   const handleMaxPriceChange = (maxPrice) => {
//     setFilterOptions({ ...filterOptions, maxPrice });
//   };

//   const handleCategoryChange = (category) => {
//     setFilterOptions({ ...filterOptions, category });
//   };

//   const handleSortChange = (sortBy) => {
//     // Update the filter options state
//     setFilterOptions({
//       ...filterOptions,
//       sortBy: sortBy
//     });
//   };

//   const filterAndSortProducts = () => {
//     let filteredProducts = [...results];

//     // Apply price range filter
//     filteredProducts = filteredProducts.filter(item => 
//       (!filterOptions.minPrice || item.price >= filterOptions.minPrice) &&
//       (!filterOptions.maxPrice || item.price <= filterOptions.maxPrice)
//     );

//     // Apply category filter
//     if (filterOptions.category) {
//       filteredProducts = filteredProducts.filter(item => 
//         item.category === filterOptions.category
//       );
//     }

//     // Sort products based on sort option
//     if (filterOptions.sortBy === 'purchase_count') {
//       filteredProducts.sort((a, b) => b.purchase_count - a.purchase_count);
//     } else if (filterOptions.sortBy === 'rating') {
//       filteredProducts.sort((a, b) => b.rating - a.rating);
//     } else if (filterOptions.sortBy === 'discount') {
//       filteredProducts.sort((a, b) => {
//         if (a.discount_pct === null) return 1;
//         if (b.discount_pct === null) return -1;
//         return b.discount_pct - a.discount_pct;
//       });
//     }

//     return filteredProducts;
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   const filteredProducts = filterAndSortProducts();

//   return (
//     <>
//       <div className="nav-bar-hah">
//         <Navbar />
//       </div>
//       <div className="search-results">
//         {/* <div className="filter-section">
//           <Title title="Filter"/>
    
//           <div className="price-range-filter">
//             <label htmlFor="min-price">Min Price:</label>
//             <input type="number" id="min-price" onChange={(e) => handleMinPriceChange(e.target.value)} value={filterOptions.minPrice} />
//             <label htmlFor="max-price">Max Price:</label>
//             <input type="number" id="max-price" onChange={(e) => handleMaxPriceChange(e.target.value)} value={filterOptions.maxPrice} />
//           </div>
    
//           <div className="category-filter">
//             <label htmlFor="category">Category:</label>
//             <select id="category" onChange={(e) => handleCategoryChange(e.target.value)} value={filterOptions.category}>
//               <option value="">All</option>
//               <option value="electronics">Electronics</option>
//               <option value="clothing">Clothing</option>
 
//             </select>
//           </div>
//         </div> */}
//         <div className="results-of-products">
//           <br />
//           {filteredProducts.length === 0 ? (
//             <div className="no-results-message">Sorry, no products match your search.</div>
//           ) : (
//             <>
//               <br />
//               <div className="search-results-info">Search Results: {filteredProducts.length}</div>
//               <div className="popular">
//                 {filteredProducts.map((item) => (
//                   <Item key={item.product_id} id={item.product_id} name={item.name} price={Math.round(item.price)} photo={item.photo_url} description={item.description} new_price={item.new_price} discount_pct={item.discount_pct} rating={item.rating}/>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//     </>
//   );
// };

// export default SearchResults;
// import React, { useState, useEffect } from 'react';
// import './SearchResults.css';
// import Item from '../Item/Item';
// import Navbar from '../Navbar/Navbar';
// import Loading from '../Loading/Loading';
// import { useLocation } from 'react-router-dom';
// import FilterSection from '../Filter/FilterMenu'; 
// const SearchResults = () => {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchCount, setSearchCount] = useState(0);

//   const location = useLocation();

//   useEffect(() => {
//     // Fetch results based on filters
//     const fetchResults = async (filters) => {
//       setLoading(true);

//       try {
//         const response = await fetch(
//           `http://localhost:5000/search?search=${encodeURIComponent(filters.searchQuery)}&option=${encodeURIComponent(filters.searchOption)}&category=${encodeURIComponent(filters.category)}&minPrice=${encodeURIComponent(filters.minPrice)}&maxPrice=${encodeURIComponent(filters.maxPrice)}`
//         );

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         setResults(data.results);
//         setSearchCount(data.results.length);
//       } catch (error) {
//         console.error('Error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (location.search) {
//       // Parse query parameters and fetch results
//       const queryParams = new URLSearchParams(location.search);
//       const searchQuery = queryParams.get('search');
//       const searchOption = queryParams.get('option');
//       const category = queryParams.get('category');
//       const minPrice = queryParams.get('minPrice');
//       const maxPrice = queryParams.get('maxPrice');

//       const filters = {
//         searchQuery,
//         searchOption,
//         category,
//         minPrice,
//         maxPrice,
//       };

//       fetchResults(filters);
//     }
//   }, [location]);

//   const handleFilterChange = (priceRange, selectedCategory) => {
//     // Update the URL with the new filters
//     const queryParams = new URLSearchParams();
//     queryParams.set('search', 'your_search_query'); // Add your search query logic here
//     queryParams.set('option', 'your_search_option'); // Add your search option logic here
//     queryParams.set('category', selectedCategory);
//     queryParams.set('minPrice', priceRange.min);
//     queryParams.set('maxPrice', priceRange.max);

//     // Replace the current URL with the updated URL
//     window.history.replaceState({}, '', `${window.location.pathname}?${queryParams}`);
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <>
//       <Navbar />
//       <br />
//       {results.length === 0 ? (
//         <div className="no-results-message">Sorry, no products match your search.</div>
//       ) : (
//         <>
//           <div className="search-results-info">Search Results: {searchCount}</div>
//           <div className="popular">
//             {results.map((item) => (
//               <Item key={item.product_id} id={item.product_id} name={item.name} price={Math.round(item.price)} photo={item.photo_url} description={item.description} new_price={item.new_price} discount_pct={item.discount_pct} rating={item.rating}/>
//             ))}
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default SearchResults;

import React, { useState, useEffect } from 'react';
import './SearchResults.css';
import Item from '../Item/Item';
import Navbar from '../Navbar/Navbar';
import Loading from '../Loading/Loading';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCount, setSearchCount] = useState(0);
  const [filterOptions, setFilterOptions] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: ''
  });

  const location = useLocation();

  useEffect(() => {
    // Fetch results based on filters
    const fetchResults = async (filters) => {
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:5000/search?search=${encodeURIComponent(filters.searchQuery)}&option=${encodeURIComponent(filters.searchOption)}&category=${encodeURIComponent(filters.category)}&minPrice=${encodeURIComponent(filters.minPrice)}&maxPrice=${encodeURIComponent(filters.maxPrice)}&sortBy=${encodeURIComponent(filters.sortBy)}`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setResults(data.results);
        setSearchCount(data.results.length);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (location.search) {
      // Parse query parameters and fetch results
      const queryParams = new URLSearchParams(location.search);
      const searchQuery = queryParams.get('search');
      const searchOption = queryParams.get('option');

      const filters = {
        searchQuery,
        searchOption,
        category: filterOptions.category,
        minPrice: filterOptions.minPrice,
        maxPrice: filterOptions.maxPrice,
        sortBy: filterOptions.sortBy
      };

      fetchResults(filters);
    }
  }, [location, filterOptions]);

  const handleFilterChange = (priceRange, selectedCategory, sortBy) => {
    // Update the filter options state
    setFilterOptions({
      ...filterOptions,
      category: selectedCategory,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sortBy: sortBy
    });
  };

  const handleSortChange = (sortBy) => {
    // Update the filter options state
    setFilterOptions({
      ...filterOptions,
      sortBy: sortBy
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
    <div className="nav-bar-hah">
    <Navbar />
    </div>
          <br />
        {results.length === 0 ? (
          <div className="no-results-message">Sorry, no products match your search.</div>
        ) : (
          <>
          <br />
          <div className="search-results-info">Search Results: {searchCount}</div>
            <div className="popular">
              {results.map((item) => (
                <Item key={item.product_id} id={item.product_id} name={item.name} price={Math.round(item.price)} photo={item.photo_url} description={item.description} new_price={item.new_price} discount_pct={item.discount_pct} rating={item.rating}/>
              ))}
            </div>
          
          </>
        )}
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default SearchResults;
