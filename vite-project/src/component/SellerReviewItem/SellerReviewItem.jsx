import React, { useState } from 'react';
import './SellerReviewItem.css'; // Import your CSS file for styling
import Star from '../Star/Star';

const ReviewItem = ({ review, onReplySubmit }) => {
  const {user_id, review_text, reply_text, created_at, rating, author, name, description, photo_url,product_id } = review;
  const [reply, setReply] = useState('');

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/seller/submit-reply", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, product_id,reply }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit reply");
      }
  
      const { success } = await response.json();
      if (success) {
        alert("Reply submitted");
      } else {
        alert("Submission unsuccessful, please try again");
      }
    } catch (error) {
      console.error("Error submitting reply:", error.message);
      alert("Error submitting reply. Please try again later.");
    }
  };
  
  return (
    <div className="review-item-seller">
      <div className="product-details">
        <div className="product-name">Product: {name}</div>
        <div className="product-description">Description: {description}</div>
        <img src={photo_url} alt="Product" className="product-photo" />
      </div>
      <Star rating={rating} size={0.95}/>
      <div className="author">{author}</div>
      <div className="review-text">Review: {review_text}</div>
     
      <div className="review-text">Reviewed At: {new Date(created_at).toLocaleDateString()}</div>

      {reply_text ?  <div className="reply-text"> Reply:  {reply_text}</div> : (
        <div className="reply-form">
          <textarea className='signin-input' value={reply} onChange={handleReplyChange} placeholder="Type your reply here..." />
          <button className='change-password-button' onClick={handleSubmitReply}>Submit Reply</button>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
