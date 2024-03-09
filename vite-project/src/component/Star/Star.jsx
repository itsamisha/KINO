import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function Star({ rating ,size}) {
  const wrapper = {
    display: "inline-flex",
    padding: "0",
  };

  const renderStars = () => {
    const stars = [];
    const floorRating = Math.floor(rating);

    const starStyle = {
      fontSize: `${size}rem`, 
      color: "#ffd700",
    };
  
    for (let i = 0; i < floorRating; i++) {
      stars.push(<FaStar key={i} style={starStyle} />);
    }
  
    const decimalPart = rating - floorRating;
    if (decimalPart > 0) {
      stars.push(<FaStarHalfAlt key="half" style={starStyle} />);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={i + floorRating} style={{ fontSize: `${size}rem`, color: "#b6b2ac" }} />);
    }
  
    return stars;
  };
  

  return <div style={wrapper}>{renderStars()}</div>;
}