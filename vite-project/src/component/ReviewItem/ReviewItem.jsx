import React from 'react';
import './ReviewItem.css'; // Import your CSS file for styling
import Star from '../Star/Star';

const ReviewItem = (props) => {
  const { review_text, reply_text, created_at, rating, author } = props;

  return (
    <div className="review-item">
      <Star rating={rating} size={0.95}/>
      <div className="author">{author}</div>
      <div className="review-text">{review_text}</div>
      <div className="reply-text">{reply_text}</div>
      <div className="created-at">{new Date(created_at).toLocaleDateString()}</div>
    </div>
  );
};

export default ReviewItem;
