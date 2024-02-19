import './InventoryItem.css'
import { FaTrashAlt,FaCartPlus } from "react-icons/fa";
import { useSellerAuth } from '../../context/SellerAuthContext';
import { Link, Navigate } from 'react-router-dom';

const InventoryItem = (props) => {
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
  const {authUser} = useSellerAuth()
  const user_id = authUser.user_id;

  async function deleteWishlist(){
    try {
      const response = await fetch("http://localhost:5000/seller/remove-from-inventory", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, product_id }),
      });
  
      if (response.ok) {
        console.log("Product removed from inventory successfully!");
        console.log("done");
        window.location.reload();
      } else {
        console.error("Failed to remove product from inventory:", response.statusText);
      }
    } catch (error) {
      console.error("Error removing product from invntory:", error.message);
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
        <div className="buttons">
          &nbsp;&nbsp;&nbsp;&nbsp;
          <FaTrashAlt className='delete' onClick={deleteWishlist}/>
        </div>
      </div>
    </div>
  )
}

export default InventoryItem;
