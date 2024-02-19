import React, { useState,useEffect } from 'react';
import './Review.css'; 
import ReviewItem from '../ReviewItem/ReviewItem';

const Review= ({ product_id }) => {

  const [isExpanded, setIsExpanded] = useState(false);
  const [reviews, setReviews] = useState([]);

  const getReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/reviews/${product_id}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);


  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return ( 
    <div className="review">
      <div className="review-header" onClick={toggleExpansion}>
        <span>{isExpanded ? '▼' : '►'}</span>
        <span className="review-title">Reviews</span>
      </div>
      {isExpanded && (
        <div className="review-container">
        <div className="review-scroll">
          {reviews.map((review, index) => (
            <ReviewItem key={index} review={review} />
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

export default Review;

