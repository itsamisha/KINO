import React, { useState } from "react";
import "../ProfileForm/ProfileForm.css"; // Importing styles
import Successful from "../Successful/Successful";
import Backdrop from "../Backdrop/Backdrop";
import Title from "../Title/Title";
import Star from "../Star/Star"; 
import "../../css/Registration.css"; 
import "./ReviewForm.css";
import { useAuth } from "../../context/AuthContext";
function ReviewForm(props) {
  const [rating, setRating] = useState(props.rating);
  const [reviewText, setReviewText] = useState(props.review_text);
  const [showSuccess, setShowSuccess] = useState(false);
  const {authUser} = useAuth();
  const handleShowSuccess = () => {
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (props.type === 'Edit Review') {
      try {
        const response = await fetch("http://localhost:5000/customer/edit-review", {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: authUser.user_id,
            product_id: props.product_id,
            new_rating: rating,
            new_review_text: reviewText
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        // Reload the page after successful update
        window.location.reload();
      } catch (error) {
        console.error('Error updating review:', error.message);
        alert('Failed to update review. Please try again.');
      }
    } 
    else if (props.type === 'Add Review') {
        try {
          const response = await fetch("http://localhost:5000/customer/add-review", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: authUser.user_id,
              product_id: props.product_id,
              review_text: reviewText,
              rating: rating
            }),
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          // Show success message
          window.location.reload();
        } catch (error) {
          console.error('Error adding review:', error.message);
          alert('Failed to add review. Please try again.');
        }
      } else {
      setShowSuccess(true);
    }
  };
  
  
  const handleRatingChange = (e) => {
    setRating(parseInt(e.target.value));
  };

  return (
    <>
      <div className="customer-modal">
        <div className="reg-review-form">
          {" "}
          <Title title={props.type} /> {/* Use the same title class */}
          <div className="prod">
            <img src={props.photo} alt="" className="image-of-prod"/>
          </div>
          <div className="signin-label" style={{textAlign:"center", fontSize:"16px"}}>{props.name}</div>
          <div className="rating-stars">
            {" "}
            {/* Use the same rating-stars class */}
            <Star rating={rating} size={1.75} />
          </div>
         
          <form onSubmit={handleSubmit}>
            <div className="flex-start">
              {" "}
              {/* Use the same flex-start class */}
              <label className="signin-label">Rating:</label>
              <input
                type="range"
                min="0"
                max="5"
                value={rating}
                onChange={handleRatingChange}
                step="1"
                className="slider"
              />
            </div>
            <br />
            <br />
            <div className="flex-start">
              {" "}
              {/* Use the same flex-start class */}
              <label className="signin-label">Review Text:</label>
              <input
                type="text"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Enter your review..."
                className="signin-input"
              />
            </div>
            <div className="button-container">
              {" "}
              {/* Use the same button-container class */}
              <button type="submit" className="btn">
                Submit
              </button>{" "}
              {/* Use the same btn class */}
              <button type="button" className="btn" onClick={props.onCancel}>
                Cancel
              </button>{" "}
              {/* Use the same btn class */}
            </div>
          </form>
        </div>
      </div>
      {showSuccess && (
        <>
          <Backdrop />{" "}
          <Successful
            message={`Review submitted successfully!`}
            onClose={handleShowSuccess}
          />
        </>
      )}
    </>
  );
}

export default ReviewForm;
