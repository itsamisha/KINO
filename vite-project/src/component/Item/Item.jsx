import './Item.css'
import image from '../assets/logo_full_big.png'
import Star from '../Star/Star'
import Heart from '../Heart/Heart'
import { Link } from "react-router-dom";
const Item = (props) => {
  function truncateString(str, maxWords) {
    const words = str.split(/\s+/);
    const truncatedWords = words.slice(0, maxWords);
    const truncatedString = truncatedWords.join(' ');
    if (words.length > maxWords) {
        return truncatedString + ' ...';
    }
    return truncatedString;
}

  return (
    <div className='item'>
      <Link style={{textDecoration : 'none',color:'#000000'}} to={`/product/${props.id}` }>
      {(props.photo===null || props.photo===undefined)? <img src={image} className="item__image" alt=""/> : <img src={props.photo} className="image"alt=""/>}
      <br/><br/>
      <div className='name'>{truncateString(props.name,7)}</div>
        <div className="price">৳{props.price}
      </div>
      </Link>
       <Star rating={0}/>
    </div>
  )
}

export default Item
