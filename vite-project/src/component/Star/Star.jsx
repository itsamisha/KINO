// import {FaStar} from "react-icons/fa"

// export default function Star({rating}) {

//     const wrapper = {
//         display :'inline-flex',
//         padding: '0 0.75rem'
//     }
//     return (
//         <div style={wrapper}>
//         {[...Array(5)].map((star,index) => {
//             return <FaStar color={(index>(rating-1))? "#b6b2ac" : "#FDCC0D"}/>
//         })}
//         </div>
//     );
// }

import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function Star({ rating }) {
  const wrapper = {
    display: "inline-flex",
    padding: "0",
  };

  const renderStars = () => {
    const stars = [];
    const floorRating = Math.floor(rating);

    // Render fully filled stars
    for (let i = 0; i < floorRating; i++) {
      stars.push(<FaStar key={i} color="#FDCC0D" />);
    }

    // Render partially filled star for fractional part
    const decimalPart = rating - floorRating;
    if (decimalPart > 0) {
      stars.push(<FaStarHalfAlt key="half" color="#FDCC0D" />);
    }

    // Render empty stars for remaining space
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={i + floorRating} color="#b6b2ac" />);
    }

    return stars;
  };

  return <div style={wrapper}>{renderStars()}</div>;
}

