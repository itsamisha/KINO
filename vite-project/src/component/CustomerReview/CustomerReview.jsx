import { useState, useEffect } from "react";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import CustomerReviewItem from "../CustomerReviewItem/CustomerReviewItem";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Title from "../Title/Title";
import Loading from "../Loading/Loading";
import ContinueShopping from "../ContinueShopping/ContinueShopping";
import Footer from "../Footer/Footer";

const CustomerReview = () => {
  const { isLoggedIn, authUser } = useAuth();
  const userId = authUser.user_id;
  const [reviews, setReviews] = useState([]);
  const [selectedOption, setSelectedOption] = useState("previous");
  const [isLoading, setIsLoading] = useState(true);

  if (!isLoggedIn) {
    window.location.href = "/signin";
  }

  useEffect(() => {
    if (isLoggedIn) {
      getReviews();
    }
  }, [isLoggedIn, selectedOption]);

  const getReviews = async () => {
    try {
      const response = await fetch("http://localhost:5000/customer/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          selectedOption: selectedOption,
        }),
      });
      const data = await response.json();
      setReviews(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div>
      {!isLoading && <Navbar />}
      {!isLoading && <Sidebar />}
      {!isLoading && <Title title="REVIEWS" />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div>
            <div className="orders-tab">
              <label
                className={`orders-option ${
                  selectedOption === "previous" ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect("previous")}
              >
                Previous
              </label>
              <label
                className={`orders-option ${
                  selectedOption === "toReview" ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect("toReview")}
              >
                To Review
              </label>
            </div>
            {reviews.length > 0 ? (
              <>
                <br />
                <br />
                <br />
                {reviews.map((item) => (
                  <React.Fragment key={item.pid}>
                    <div style={{ width: "45%", margin: "0 auto" }}>
                      <CustomerReviewItem
                        key={item.pid}
                        option={selectedOption}
                        rating={item.rating}
                        review_text={item.review_text}
                        reply_text={item.reply_text}
                        created_at={item.created_at}
                        photo={item.photo_url}
                        product_id={item.pid}
                        name={item.name}
                      />
                    </div>
                    <br />
                  </React.Fragment>
                ))}
              </>
            ) : (
              <>
                <br />
                <br />
                <ContinueShopping />
              </>
            )}
          </div>
        </>
      )}
      <Footer/>
    </div>
  );
};

export default CustomerReview;
