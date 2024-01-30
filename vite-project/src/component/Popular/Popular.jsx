

import './Popular.css'
import React, { useEffect, useState } from 'react';
import Item from '../Item/Item'

const Popular = ({ title, param }) => {

  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  const getPopularProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/${param}`);
      const data = await response.json();
      console.log(data);
      setProducts(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getPopularProducts();
  }, []);

  useEffect(() => {
    setDisplayedProducts(showMore ? products : products.slice(0, 6));
  }, [showMore, products]);

  const handleToggleShowMore = () => {
    setShowMore(!showMore);
  }

  return (
    <div className="container">
      {displayedProducts.length>0? <div className="popular-h1-container"> 
        <h1 className='popular-h1'>{`${title}`}</h1>
      </div>
      : <></>}
      <div className='popular'>
        {displayedProducts.map((item) => {
          return <Item key={item.product_id} id={item.product_id} name={item.name} price={item.price} photo={item.photo_url} description={item.description} new_price ={item.new_price} discount_pct ={item.discount_pct} />
        })}
      </div>
      <button onClick={handleToggleShowMore} className="show-more-button">
        {showMore ? "Show Less" : "Show More"}
      </button>
    </div>
      
  )
}

export default Popular;

