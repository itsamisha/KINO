import React from 'react';
import './ReviewItem.css'; // Import your CSS file for styling
import Star from '../Star/Star';

const ReviewItem = (props) => {
  const { review_text, reply_text, created_at, rating, author,shop } = props.review;

  return (
    <div className="product-review-item">
      <Star rating={rating} size={0.95}/>
      <div className="product-author">{author}</div>
      <div className="product-review-text">{review_text}</div>
      {reply_text && <div className='replies'> <div className="m">{shop}</div>
      <div className="product-reply-text">- {reply_text}</div></div>}
      <div className="product-created-at">{new Date(created_at).toLocaleDateString()}</div>
    </div>
  );
};

export default ReviewItem;
