
import React, { useState } from 'react';
import Navbar from '../component/Navbar/Navbar';
import '../css/GiftCard.css';
import ImageSlider from '../component/ImageSlider/ImageSlider';
import Footer from '../component/Footer/Footer';

const containerStyles = {
    width: "75rem",
    height: "30rem",
    margin: "0 auto",
    marginTop: "3rem"
};

const urls = [
    '/src/component/assets/gift-card-banner-1.png',
    '/src/component/assets/gift-card-banner-2.png',
    '/src/component/assets/gift-card-banner-3.png'
];


const GiftCard = () => {
    
    const handleBuyNow = () => {
        window.location.href = "/gift-card-purchase";
    }

    return (
        <div>
            <Navbar />
            <div style={containerStyles}>
                <ImageSlider urls={urls} />
            </div>
            <br />
            <br />
            <br />
            <br />
            <div className="buy-now-container">
                <button className="buy-now-button" onClick={handleBuyNow}>BUY NOW</button>
            </div>
            <br />
            <br />
            <Footer/>
        </div>
    );
};

export default GiftCard;
