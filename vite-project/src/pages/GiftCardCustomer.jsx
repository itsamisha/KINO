import { useState, useEffect } from "react";
import React from "react";
import { useAuth } from "../context/AuthContext";
import GiftCardItem from "../component/GiftCardItem/GiftCardItem";
import Navbar from "../component/Navbar/Navbar";
import Sidebar from "../component/Sidebar/Sidebar";
import Title from "../component/Title/Title";
import Loading from "../component/Loading/Loading"; // Import your loading component

const GiftCardCustomer = () => {
  const { isLoggedIn, authUser } = useAuth();
  const userId = authUser.user_id;
  const [giftcards, setGiftcards] = useState([]);
  const [selectedOption, setSelectedOption] = useState("received");
  const [isLoading, setIsLoading] = useState(true);

  if (!isLoggedIn) {
    window.location.href = "/signin";
  }

  useEffect(() => {
    if (isLoggedIn) {
      getGiftcards();
    }
  }, [isLoggedIn, selectedOption]);

  const getGiftcards = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/giftcard/${selectedOption}/${userId}`
      );
      const data = await response.json();

      setGiftcards(data);
      console.log(giftcards);
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
      {!isLoading && <Title title="GIFT CARDS" />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div>
            <div className="orders-tab">
              <label
                className={`orders-option ${
                  selectedOption === "received" ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect("received")}
              >
                Received
              </label>
              <label
                className={`orders-option ${
                  selectedOption === "sent" ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect("sent")}
              >
                Sent
              </label>
            </div>
            {giftcards.length > 0 ? (
              <>
              <br />
              <br />
              <br />

              {
              giftcards.map((item) => (
                <React.Fragment key={item.gift_card_code}>
                  <GiftCardItem
                    name={item.from}
                    photo={item.design}
                  />
                  <br />
                </React.Fragment>
              ))}
              </>
             
            ) : (
                <ContinueShopping/> 
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GiftCardCustomer;