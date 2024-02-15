
import './CartItem.css';
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import DeleteConfirmation from '../DeleteConfirmation/DeleteConfirmation';

const CartItem = (props) => {
  function truncateString(str, maxWords) {
    const words = str.split(/\s+/);
    const truncatedWords = words.slice(0, maxWords);
    const truncatedString = truncatedWords.join(" ");
    if (words.length > maxWords) {
      return truncatedString + " ...";
    }
    return truncatedString;
  }

  const { authUser } = useAuth();
  const user_id = authUser.user_id;
  const [quantity, setQuantity] = useState(props.quantity);
  const product_id = props.id;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); 

  useEffect(() => {
    setQuantity(props.quantity);
  }, [props.quantity]);

  async function updateCartQuantity(newQuantity) {
    try {
      const response = await fetch("http://localhost:5000/customer/update-cart-quantity", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, product_id, quantity: newQuantity }),
      });

      if (response.ok) {
        console.log("Cart quantity updated successfully!");
      } else {
        console.error("Failed to update cart quantity:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error.message);
    }
  }

  const incrementQuantity = () => {
        if (quantity < props.stock_quantity) {
          const newQuantity = quantity + 1;
          setQuantity(newQuantity);
          updateCartQuantity(newQuantity);
        }
      };

      const decrementQuantity = () => {
            if (quantity > 1) {
              const newQuantity = quantity - 1;
              setQuantity(newQuantity);
              updateCartQuantity(newQuantity);
            }
          };

  const toggleDeleteConfirmation = () => {
    setShowDeleteConfirmation(!showDeleteConfirmation);
  };

  const confirmDeleteCartItem = async () => {
    try {
      const response = await fetch("http://localhost:5000/customer/delete-from-cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, product_id }),
      });

      if (response.ok) {
        console.log("Product removed from cart successfully!");
        window.location.reload();
      } else {
        console.error("Failed to remove product from cart:", response.statusText);
      }
    } catch (error) {
      console.error("Error removing product from cart:", error.message);
    }
  };

  const handleClick = () => {
    window.location.href = `/product/${props.id}`;
  };

  return (
    <div className='cart-container' >
      <img src={props.photo} alt="" className='cart-image' onClick={handleClick}/>
      <div className='cart-item'>
        <div className='cart-item-name'>{truncateString(props.name, 7)}</div>
        <br />
        <div className='cart-item-price'>
          ৳ ({props.price} X {quantity}) = ৳ {(props.price * quantity).toFixed(2)}
        </div> 
        <br /> 
        <div className="buttons">
          <div className="quantity-update">
            <FaPlus className='quantity-button' onClick={incrementQuantity} />
            <label className='quantity-count'>{quantity}</label>
            <FaMinus className='quantity-button' onClick={decrementQuantity} />
          </div>
          <FaTrashAlt className='delete' onClick={toggleDeleteConfirmation}/>
        </div>
      </div>
      {showDeleteConfirmation && (
        <DeleteConfirmation
          text='Are you sure you want to remove item from cart?'
          onDelete={confirmDeleteCartItem}
          onCancel={toggleDeleteConfirmation}
        />
      )}
    </div>
  );
}

export default CartItem;


