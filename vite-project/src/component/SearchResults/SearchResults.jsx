import React, { useState, useEffect } from 'react';
import '../Popular/Popular.css'
import { useLocation } from 'react-router-dom';
import Item from '../Item/Item'
import Navbar from '../Navbar/Navbar'
const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  
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
      } catch (error) {
        console.error('Error:', error);
        // Handle error scenario here
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
    <Navbar/>
    

      <div className='popular'>
        {results.map((item) => {
          return <Item key={item.product_id} id={item.product_id} name={item.name} price={Math.round(item.price)} photo={item.photo_url} description={item.description} />
        })}
      </div>
    </>
  );
};

export default SearchResults;
