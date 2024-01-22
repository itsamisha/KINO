// import React, { useState, useEffect } from 'react';
// import '../Popular/Popular.css'
// import './SearchResults.css'
// import { useLocation } from 'react-router-dom';
// import Item from '../Item/Item'
// import Navbar from '../Navbar/Navbar'
// import Mascot from '../Mascot/Mascot';
// const SearchResults = () => {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   const location = useLocation();

//   useEffect(() => {
//     const fetchResults = async () => {
//       setLoading(true);
      
//       try {
//         const queryParams = new URLSearchParams(location.search);
//       const searchQuery = queryParams.get('search');
//       const searchOption = queryParams.get('option');

//         const response = await fetch(`http://localhost:5000/search?search=${encodeURIComponent(searchQuery)}&option=${encodeURIComponent(searchOption)}`);
        
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         setResults(data.results);
//       } catch (error) {
//         console.error('Error:', error);
        
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (location.search) {
//       fetchResults();
//     }
//   }, [location]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }
  

//   return (
//     <>
//     <Navbar/>
//     <Mascot/>
//     {results.length === 0 ? (
//         <div className="no-results-message">Sorry, no products match your search.</div>
//       ) : (
//         <div className='popular'>
//           {results.map((item) => (
//             <Item key={item.product_id} id={item.product_id} name={item.name} price={Math.round(item.price)} photo={item.photo_url} description={item.description} />
//           ))}
//         </div>
//       )}
//     </>
//   );
// };

// export default SearchResults;
import React, { useState, useEffect } from 'react';
import '../Popular/Popular.css'
import './SearchResults.css'
import { useLocation } from 'react-router-dom';
import Item from '../Item/Item'
import Navbar from '../Navbar/Navbar'
import Mascot from '../Mascot/Mascot';

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
    return <div>Loading...</div>;
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
