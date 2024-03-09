import React, { useState, useEffect } from 'react';
import SellerReviewItem from '../component/SellerReviewItem/SellerReviewItem';
import NavbarSeller from '../component/NavbarSeller/NavbarSeller';
import Sidebar from '../component/SellerSidebar/SellerSidebar';
import { useSellerAuth } from '../context/SellerAuthContext';
import Title from '../component/Title/Title';
import '../css/Orders.css';
import Footer from '../component/Footer/Footer';

const SellerReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedOption, setSelectedOption] = useState("unrepliedreviews");
  const { authUser } = useSellerAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const id = parseInt(authUser.user_id)

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/seller/${id}/${selectedOption}`);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error.message);
      }
    };

    fetchReviews();
  }, [authUser.user_id,selectedOption]);

  const filteredReviews = reviews.filter((order) =>
  order.name.toLowerCase().includes(searchQuery.toLowerCase())
);


  return (
    <div>
      <NavbarSeller />
      <Sidebar />
      <Title title="REVIEWS AND REPLIES" />
      <div className="orders-tab">

        <label
          className={`orders-option ${
            selectedOption === "unrepliedreviews" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("unrepliedreviews")}
        >
          Unreplied Reviews
        </label>
        <label
          className={`orders-option ${
            selectedOption === "repliedreviews" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("repliedreviews")}
        >
          Replied Reviews
        </label>
      </div>
      <br /><br />
      {reviews.length > 0 && (
        <>
        <br />
        <br />
         <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Reviews By Product Name..."
          className="searchWishlist"
        />
        <br />
        <br />
        </>
       
      )}
      <div className="orders-list">
     
        {filteredReviews.map(review => (
          <SellerReviewItem key={review.id} review={review} />
        ))}
      </div>
      <Footer/>
    </div>
  );
};

export default SellerReviewsPage;
