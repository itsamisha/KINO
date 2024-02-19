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
        <span>{isExpanded ? "▼" : "►"}</span>
        <span className="review-title">Reviews</span>
      </div>
      {isExpanded && (
        <div className="review-container">
          <div className="review-scroll">
            {reviews.length > 0 ? (
              <>
                <h4 className="no-review">
                  Total review(s):&nbsp;{reviews.length}
                </h4>
                {reviews.map(
                  (review, index) =>
                    review.review_text.length > 0 && (
                      <ReviewItem key={index} review={review} />
                    )
                )}
              </>
            ) : (
              <>
                <h4 className="no-review">No reviews found.</h4>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;

