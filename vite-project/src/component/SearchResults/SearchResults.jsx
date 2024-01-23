
// import React, { useState, useEffect } from 'react';
// import '../Popular/Popular.css';
// import './SearchResults.css';
// import Item from '../Item/Item';
// import Navbar from '../Navbar/Navbar';
// import Mascot from '../Mascot/Mascot';
// import Loading from '../Loading/Loading'; // Import the Loading component
// import { useLocation } from 'react-router-dom';

// import FilterMenu from '../Filter/FilterMenu';
// const SearchResults = () => {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({ category: '', priceRange: { min: '', max: '' } });
  
//   const location = useLocation();
//   const fetchResults = async (filters) => {
//     setLoading(true);
    
//     try {
//       const queryParams = new URLSearchParams(location.search);
//     const searchQuery = queryParams.get('search');
//     const searchOption = queryParams.get('option');
//     if (filters &&filters.category) queryParams.set('category', filters.category);
//     if (filters &&filters.priceRange.min) queryParams.set('minPrice', filters.priceRange.min);
//     if (filters &&filters.priceRange.max) queryParams.set('maxPrice', filters.priceRange.max);
//     const response = await fetch(`http://localhost:5000/search?${queryParams.toString()}`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
      
//       setResults(data.results);
//     } catch (error) {
//       console.error('Error:', error);
//       // Handle error scenario here
//     } finally {
//       setLoading(false);
//     }
//   };
//   const [debouncedFilters, setDebouncedFilters] = useState(filters);

//   const debounce = (callback, delay) => {
//     let timer;
//     return (...args) => {
//       clearTimeout(timer);
//       timer = setTimeout(() => { callback.apply(this, args); }, delay);
//     };
//   };

//   // Update debouncedFilters after a delay when filters change
//   useEffect(() => {
//     const handler = debounce(() => setDebouncedFilters(filters), 2500); // 500ms delay
//     handler();
//   }, [filters]);

//   // Fetch results when debouncedFilters change
//   useEffect(() => {
//     if (debouncedFilters.category || debouncedFilters.priceRange.min || debouncedFilters.priceRange.max) {
//       fetchResults(debouncedFilters);
//     }
//   }, [debouncedFilters]);
//   useEffect(() => {
    

//     if (location.search) {
//       fetchResults(filters);
//     }
//   }, [location]);
//   useEffect(() => {
//     if (filters.category) {
//       fetchResults(filters);
//     }
//   }, [filters.category]);
  
//   if (loading) {
//     return <Loading />;
//   }
//   const onFilterChange = (newPriceRange, newCategory) => {
    
//     setFilters({
//       category: newCategory,
//       priceRange: {
//         min: newPriceRange.min,
//         max: newPriceRange.max
//       }
//     });
//     //fetchResults(filters);
    
//   };
//   // useEffect(() => {
//   //   fetchResults(filters);
//   // }, [filters]);
//   const applyPriceFilters = () => {
//     fetchResults(filters);
//   };
  
  

//   return (
//     <>
//     <Navbar/>
//     <FilterMenu onFilterChange={onFilterChange} onApplyPriceFilters={applyPriceFilters} />

//       <div className='popular'>
//         {results.map((item) => {
//           return <Item key={item.product_id} id={item.product_id} name={item.name} price={Math.round(item.price)} photo={item.photo_url} description={item.description} />
//         })}
//       </div>
//     </>
//   );
// };

// export default SearchResults;

import React, { useState, useEffect } from 'react';
import '../Popular/Popular.css';
import './SearchResults.css';
import Item from '../Item/Item';
import Navbar from '../Navbar/Navbar';
import Mascot from '../Mascot/Mascot';
import Loading from '../Loading/Loading'; // Import the Loading component
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCount, setSearchCount] = useState(0);
  
  const location = useLocation();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      
      try {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('search');
        const searchOption = queryParams.get('option');

        const response = await fetch(`http://localhost:5000/search?search=${encodeURIComponent(searchQuery)}&option=${encodeURIComponent(searchOption)}`);
        
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
      fetchResults();
    }
  }, [location]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <Mascot />
      {results.length === 0 ? (
        <div className="no-results-message">Sorry, no products match your search.</div>
      ) : (
        <>
          <div className="search-results-info">Search Results: {searchCount}</div>
          <div className='popular'>
            {results.map((item) => (
              <Item key={item.product_id} id={item.product_id} name={item.name} price={Math.round(item.price)} photo={item.photo_url} description={item.description} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default SearchResults;
