import React, { useState, useEffect } from 'react';
import SellerReviewItem from '../component/SellerReviewItem/SellerReviewItem'; // Import the SellerReviewItem component
//import './SellerReviewsPage.css'; // Import your CSS file for styling
import NavbarSeller from '../component/NavbarSeller/NavbarSeller';
import Sidebar from '../component/SellerSidebar/SellerSidebar';
import { useSellerAuth } from '../context/SellerAuthContext';

const SellerReviewsPage = () => {
  // State variables to store unreplied and replied reviews
  const [unrepliedReviews, setUnrepliedReviews] = useState([]);
  const { isLoggedIn, authUser } = useSellerAuth();
  const [repliedReviews, setRepliedReviews] = useState([]);
  const id = parseInt(authUser.user_id);
   console.log(id);
  // Function to fetch unreplied and replied reviews from the database
  const fetchUnrepliedReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/seller/${id}/unrepliedreviews`
      );
      const data = await response.json();
      console.log(data);
      setUnrepliedReviews(data); // Update state with fetched data
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchRepliedReviews = async () => {
    try {
      const repliedData = await fetch(
        `http://localhost:5000/seller/${id}/repliedreviews`
      );
      const data = await repliedData.json();
      console.log(data);
      setRepliedReviews(data); // Update state with fetched data
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchReviews = async () => {
    // Make API calls to fetch unreplied and replied reviews
    await fetchUnrepliedReviews();
    await fetchRepliedReviews();
  };

  // useEffect hook to fetch reviews when the component mounts or authUser.id changes
  useEffect(() => {
    if (authUser.user_id) {
      fetchReviews();
    }
  }, [authUser.user_id]);

  // Function to handle submitting a reply to a review
  const handleReplySubmit = async (replyData) => {
    try {
      // Make API call to submit the reply to the database
      // Example: await submitReply(replyData);

      // After successful submission, fetch updated reviews
      fetchReviews();
    } catch (error) {
      console.error('Error submitting reply:', error.message);
      // Handle error (e.g., display error message to the seller)
    }
  };

  return (
    <div className="seller-reviews-page">
      <NavbarSeller/>
      <Sidebar/>
      <div className="unreplied-reviews-section">
        <h2>Unreplied Reviews</h2>
        {unrepliedReviews.map((review) => (
          <SellerReviewItem
            key={review.id}
            review={review}
            onSubmitReply={handleReplySubmit}
          />
        ))}
      </div>
      <div className="replied-reviews-section">
        <h2>Replied Reviews</h2>
        {repliedReviews.map((review) => (
          <SellerReviewItem
            key={review.id}
            review={review}
            onSubmitReply={handleReplySubmit}
          />
        ))}
      </div>
    </div>
  );
};

export default SellerReviewsPage;
