import './WishlistItem.css'
import { FaTrashAlt,FaCartPlus } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';

const WishlistItem = (props) => {
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
  const user_id = authUser.user_id;

  async function deleteWishlist(){
    try {
      const response = await fetch("http://localhost:5000/customer/remove-from-wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, product_id }),
      });
  
      if (response.ok) {
        console.log("Product removed from wishlist successfully!");
        window.location.reload();
      } else {
        console.error("Failed to remove product from wishlist:", response.statusText);
      }
    } catch (error) {
      console.error("Error removing product from wishlist:", error.message);
    }
  }
  const handleClick = () => {
    window.location.href =  `/product/${props.id}`
  };

  return (
    <div className='wishlist-container' >
      <img src={props.photo} alt="" className='wishlist-image' onClick={handleClick}/>
      <div className='wishlist-item'>
        <div className='wishlist-item-name'>{truncateString(props.name, 7)}</div>
        {props.discount>0? 
        <div className='wishlist-item-discount'>{props.discount}% OFF</div> : <></> }
        <br/> <br />
        <div className="buttons">
          <FaCartPlus className='add-to-cart'/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <FaTrashAlt className='delete' onClick={deleteWishlist}/>
        </div>
      </div>
    </div>
  )
}

export default WishlistItem
