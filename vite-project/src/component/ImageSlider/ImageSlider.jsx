import React, { useState, useEffect } from "react";

const ImageSlider = ({ urls }) => {
  const [index, setIndex] = useState(0);

  const sliderStyles = {
    height: "100%",
    position: "relative",
  };
  const slideStyles = {
    width: "100%",
    height: "100%",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundImage: `url(${urls[index]})`,
  };

  const leftArrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translate(0,-50%)",
    left: "32px",
    fontSize: "55px",
    zIndex: 1,
    cursor: "pointer",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    color: "white",
  };

  const rightArrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translate(0,-50%)",
    right: "32px",
    fontSize: "55px",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    color: "white",
    zIndex: 1,
    cursor: "pointer",
  };

  const dotsContainerStyles = {
    display: "flex",
    justifyContent: "center",
  };

  const dotsStyles_black = {
    margin: "0 3px",
    cursor: "pointer",
    fontSize: "30px",
    color: "#120708",
  };

  const dotsStyles_red = {
    margin: "0 3px",
    cursor: "pointer",
    fontSize: "30px",
    color: "#f4828a",
  };

  const goToNext = () => {
    const isFirstSlide = index === 0;
    const newIndex = isFirstSlide ? urls.length - 1 : index - 1;
    setIndex(newIndex);
  };

  const goToPrevious = () => {
    const isLastSlide = index === urls.length - 1;
    const newIndex = isLastSlide ? 0 : index + 1;
    setIndex(newIndex);
  };

  const goToSlide = (urlIndex) => {
    setIndex(urlIndex);
  };

  useEffect(() => {
    const intervalId = setInterval(goToPrevious, 2000); 
    return () => clearInterval(intervalId);
  }, [index]);

  return (
    <div style={sliderStyles}>
      <div style={leftArrowStyles} onClick={goToNext}>
        «
      </div>
      <div style={rightArrowStyles} onClick={goToPrevious}>
        »
      </div>
      <div style={slideStyles}></div>
      <div style={dotsContainerStyles}>
        {urls.map((url, urlIndex) => {
          return (
            <div
              style={
                urlIndex !== index ? dotsStyles_black : dotsStyles_red
              }
              key={urlIndex}
              onClick={() => goToSlide(urlIndex)}
            >
              ●
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageSlider;
