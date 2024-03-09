import React, { useState } from 'react';
import './SellerReviewItem.css'; // Import your CSS file for styling
import Star from '../Star/Star';

const ReviewItem = ({ review, onReplySubmit }) => {
  const {user_id, review_text, reply_text, created_at, rating, author, name, customer_name, photo_url,product_id } = review;
  const [reply, setReply] = useState('');
  const handleReplyChange = (e) => { 
    setReply(e.target.value);
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) {
      alert("Reply cannot be empty");
      return;
    }
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
        window.location.reload();
      } else {
        alert("Submission unsuccessful, please try again");
      }
    } catch (error) {
      console.error("Error submitting reply:", error.message);
      alert("Error submitting reply. Please try again later.");
    }
  };
  
  return (
    <>
    <div className="big-cont">

    <div className="review-item-seller">
      <div className="product-details">
        <div className="product-name">{name}</div>
        <img src={photo_url} alt="Product" className="product-photo" />
      </div>
      <div className="rev-cont-a">
        <br />
        <br />
      <Star rating={rating} size={1.25}/>

      <div className="rev-review-text">"{review_text}"</div>
      <div className="author-cus">-{customer_name}</div>
     <br />
      <div className="review-text">{new Date(created_at).toLocaleDateString()}</div>
      </div>
    </div>
    {reply_text ?  <div className="reply-text"> Reply:  {reply_text}</div> : (
            <div className="reply-form">
              <br />
              <textarea className='signin-input' value={reply} onChange={handleReplyChange} placeholder="Type your reply here..." required />
              <button className='button-sub' onClick={handleSubmitReply}>Submit Reply</button>
            </div>
          )}
              </div>
              <br />
              <br />
          </>
  );
};

export default ReviewItem;
