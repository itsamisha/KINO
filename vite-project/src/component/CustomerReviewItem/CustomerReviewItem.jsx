import React, { useState } from "react";
import "./CustomerReviewItem.css";
import Star from "../Star/Star";
import { FaPenToSquare } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import ReviewForm from "../ReviewForm/ReviewForm"; // Import the ReviewForm component
import { useAuth } from "../../context/AuthContext";
import { MdOutlineRateReview } from "react-icons/md";
const CustomerReviewItem = (props) => {
  console.log(props)
  const { authUser } = useAuth();
  const {
    photo,
    review_text,
    reply_text,
    created_at,
    rating,
    product_id,
    name,
    option,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [addReview, setAddReview] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleAddReview = () => {
    setAddReview(true);
  };

  const handleCancelAdd = () => {
    setAddReview(false);
  };

  const deleteReview = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/customer/delete-review",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: authUser.user_id, // Assuming you have access to user_id in props
            product_id: props.product_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Handle deletion success, for example, reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error deleting review:", error.message);
      alert("Failed to delete review. Please try again.");
    }
  };

  function truncateString(str, maxWords) {
    const words = str.split(/\s+/);
    const truncatedWords = words.slice(0, maxWords);
    const truncatedString = truncatedWords.join(" ");
    if (words.length > maxWords) {
      return truncatedString + " ...";
    }
    return truncatedString;
  }

  return (
    <>
      <div className="review-container">
        <img
          src={photo}
          alt=""
          className="review-image"
          onClick={() => (window.location.href = `/product/${product_id}`)}
        />
        <div className="cus-review-item">
          {option === "previous" && (
            <div className="created-at">
              {new Date(created_at).toLocaleDateString()}
            </div>
          )}
          <br />
          <div className="review-item-name">{truncateString(name, 7)}</div>
          {option === "previous" && (
            <>
              <div className="rating-cont">
                <div className="rating-label">&nbsp;({rating})</div>
                <Star rating={rating} size={1.05} />
              </div>
              <div className="review-text">{review_text}</div>
              <div className="reply-text">{reply_text}</div>
              <div className="button-cont">
                <FaPenToSquare className="edit-pen" onClick={handleEditClick} />
                <FaTrashAlt className="edit-pen" onClick={deleteReview} />
              </div>
            </>
          )}
          {option !== "previous" && (
            <>
              <br />
              <br />
              <br />
              <MdOutlineRateReview
                className="add-rev"
                onClick={handleAddReview}
              />
            </>
          )}
        </div>
      </div>
      {isEditing && (
        <ReviewForm
          onCancel={handleCancelEdit}
          type="Edit Review"
          rating={rating}
          review_text={review_text}
          product_id={product_id}
          photo={photo}
          name={name}
        />
      )}
      {addReview && (
        <ReviewForm
          onCancel={handleCancelAdd}
          type="Add Review"
          product_id={product_id}
          photo={photo}
          name={name}
          rating={0} // Set default rating for new review
          review_text="" // Set empty review text for new review
        />
      )}
    </>
  );
};

export default CustomerReviewItem;
