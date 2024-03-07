import './OrderHistory.css'
import { FaTrashAlt,FaCartPlus } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';

const OrderHistoryItem = (props) => {
  function truncateString(str, maxWords) {
    const words = str.split(/\s+/);
    const truncatedWords = words.slice(0, maxWords);
    const truncatedString = truncatedWords.join(" ");
    if (words.length > maxWords) {
      return truncatedString + " ...";
    }
    return truncatedString;
  }

  const product_id = props.id;
  const {authUser} = useAuth()
  const quantity = 1;
  const user_id = authUser.user_id;

  return (
    <div className='wishlist-container' >
      <img src={props.photo} alt="" className='wishlist-image' />
      <div className='wishlist-item'>
        <div className='wishlist-item-name'>{truncateString(props.name, 7)}</div>
        <div className='wishlist-item-discount'>{props.price}</div> 
        <br/> <br />
        <div className="buttons">
          
        </div>
      </div>
    </div>
  )
}

export default OrderHistoryItem
