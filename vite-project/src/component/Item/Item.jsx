import "./Item.css";
import image from "../assets/logo_full_big.png";
import Star from "../Star/Star";
import Heart from "../Heart/Heart";
import { Link } from "react-router-dom";
const Item = (props) => {
  function truncateString(str, maxWords) {
    const words = str.split(/\s+/);
    const truncatedWords = words.slice(0, maxWords);
    const truncatedString = truncatedWords.join(" ");
    if (words.length > maxWords) {
      return truncatedString + " ...";
    }
    return truncatedString;
  }
  const handleClick = () => {
    window.location.href =  `/product/${props.id}`
  };

  return (
    <div className="item" onClick={handleClick}>
        {props.photo === null || props.photo === undefined ? (
          <img src={image} className="item__image" alt="" />
        ) : (
          <img src={props.photo} className="image" alt="" />
        )}
        <br />
        <div className="name">{truncateString(props.name, 7)}</div>
        {props.new_price !== null ? (
          <div className="new-price-container">
            <div className="price">৳{props.new_price}</div>
            <div className="disc_pct">(-{props.discount_pct}%)</div>
          </div>
        ) : (
          <div className="price">৳{props.price}</div>
        )}
        <Star rating={props.rating} size={1} />
    </div>
  );
};

export default Item;
