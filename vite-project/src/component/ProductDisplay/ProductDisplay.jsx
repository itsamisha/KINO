// import "./ProductDisplay.css";
// import "../ImageSlider/ImageSlider";
// import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import Star from "../Star/Star";
// import ProductPhoto from "../ProductPhoto/ProductPhoto";
// import Heart from "../Heart/Heart";
// const ProductDisplay = (props) => {

//   const { product } = props;
//   const {isFilled} = props;
//   const {inCart} = props;
//   const url = product.photo_url;
//   const product_id = product.product_id;
//   const rating = product.rating;
//   const {isLoggedIn,authUser} = useAuth();
//   const [quantity, setQuantity] = useState(1);
//   const user_id = authUser.user_id;

//   const handleIncrement = () => {
//     if(quantity<product.stock_quantity)
//     setQuantity(quantity + 1);
//   };

//   const handleDecrement = () => {
//     if (quantity > 1) {
//       setQuantity(quantity - 1);
//     }
//   };

//   async function handleAddToWishlist() {
//     if (!isLoggedIn) {
//       window.location.href = "/signin";
//       return;
//     }
//     if(quantity>0){
//       const response = await fetch("http://localhost:5000/customer/add-to-wishlist", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ user_id, product_id }),
//       });
//     }
//   }

//   async function handleRemoveFromWishlist(){
//     if (!isLoggedIn) {
//       window.location.href = "/signin";
//       return;
//     }
  
//     try {
//       const response = await fetch("http://localhost:5000/customer/remove-from-wishlist", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ user_id, product_id }),
//       });
  
//       if (response.ok) {
//         console.log("Product removed from wishlist successfully!");
//       } else {
//         console.error("Failed to remove product from wishlist:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error removing product from wishlist:", error.message);
//     }
//   }

//   async function handleAddToCart() {
//     if (!isLoggedIn) {
//       window.location.href = "/signin";
//     }
//     const response = await fetch("http://localhost:5000/customer/add-to-cart", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ user_id, product_id, quantity}),
//     });

//     window.location.reload();
//   }
//   const containerStyles = {
//     width: "500px",
//     height: "500px",
//     margin: "auto",
//   };
//   return (
//     <div className="productdisplay">
//       <div className="productdisplay-left">
//         <div style={containerStyles}>
//           <ProductPhoto url={url} />
//         </div>
//       </div>
//       <div className="productdisplay-right">
//         <div className="name-heart-container">
//         <h2>{product.name}</h2>
//         <div className="heart">
//           <Heart onClick={handleAddToWishlist} onRemoveClick={handleRemoveFromWishlist} isFilledInit = {isFilled}/>
//         </div>
//         </div>
//         <div className="productdisplay-right-star">
//           <Star rating={rating} size={1.5} />
//         </div>

//         {product.new_price !== product.price ? (
//           <div className="productdisplay-right-prices">
//             <div className="productdisplay-right-price-new">
//               ৳{product.new_price}
//             </div>
//             <div className="productdisplay-right-price-old">
//               ৳{product.price}
//             </div>
//           </div>
//         ) : (
//           <div className="productdisplay-right-prices">
//             <div className="productdisplay-right-price-new">
//               ৳{product.price}
//             </div>
//           </div>
//         )}
//         <br />
//         <div className="productdisplay-right-description">
//           <b>Category: </b>
//           {product.category_name}
//           <br />
//           <br />
//           <b>Seller: </b>
//           {product.shop}
//         </div>
//         <br />
//         <div className="quantity-container">
//           <label htmlFor="quantity"><b>Quantity:</b></label>
//           <div className="quantity-input">
//             <button onClick={handleDecrement}>-</button>
//             <input
//               type="text"
//               id="quantity"
//               name="quantity"
//               value={quantity}
//               readOnly
//             />
//             <button onClick={handleIncrement}>+</button>
//             {product.stock_quantity===0? <p>&nbsp;&nbsp;(Out of stock)</p> : <></>}
//           </div>
//         </div>
//         <br /><br /><br />
//         {inCart>0?
//         <label className="already-in-cart">✔ ALREADY ADDED</label> 
//         :<button className="cart" onClick={handleAddToCart}>ADD TO CART</button>}
//       </div>
//     </div>
//   );
// };

// export default ProductDisplay;
import "./ProductDisplay.css";
import "../ImageSlider/ImageSlider";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Star from "../Star/Star";
import ProductPhoto from "../ProductPhoto/ProductPhoto";
import Heart from "../Heart/Heart";

const ProductDisplay = (props) => {
  const { product } = props;
  const { isFilled } = props;
  const { inCart } = props;
  const url = product.photo_url;
  const product_id = product.product_id;
  const rating = product.rating;
  const { isLoggedIn, authUser } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const user_id = authUser.user_id;

  const handleIncrement = () => {
    if (quantity < product.stock_quantity) setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  async function handleAddToWishlist() {
    if (!isLoggedIn) {
      window.location.href = "/signin";
      return;
    }
    if (quantity > 0) {
      const response = await fetch("http://localhost:5000/customer/add-to-wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, product_id }),
      });
    }
  }

  async function handleRemoveFromWishlist() {
    if (!isLoggedIn) {
      window.location.href = "/signin";
      return;
    }

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
      } else {
        console.error("Failed to remove product from wishlist:", response.statusText);
      }
    } catch (error) {
      console.error("Error removing product from wishlist:", error.message);
    }
  }

  async function handleAddToCart() {
    if (!isLoggedIn) {
      window.location.href = "/signin";
    }
    const response = await fetch("http://localhost:5000/customer/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, product_id, quantity }),
    });

    window.location.reload();
  }

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div style={{ width: "500px", height: "500px", margin: "auto" }}>
          <ProductPhoto url={url} />
        </div>
      </div>
      <div className="productdisplay-right">
        <div className="name-heart-container">
          <h2>{product.name}</h2>
          <div className="heart">
            <Heart onClick={handleAddToWishlist} onRemoveClick={handleRemoveFromWishlist} isFilledInit={isFilled} />
          </div>
        </div>
        <div className="productdisplay-right-star">
          <Star rating={rating} size={1.5} />
        </div>

        {product.new_price !== product.price ? (
          <div className="productdisplay-right-prices">
            <div className="productdisplay-right-price-new">৳{product.new_price}</div>
            <div className="productdisplay-right-price-old">৳{product.price}</div>
          </div>
        ) : (
          <div className="productdisplay-right-prices">
            <div className="productdisplay-right-price-new">৳{product.price}</div>
          </div>
        )}
        <br />
        <div className="productdisplay-right-description">
          <b>Category: </b>
          {product.category_name}
          <br />
          <br />
          <b>Seller: </b>
          {product.shop}
        </div>
        <br />
        <div className="quantity-container">
          <label htmlFor="quantity">
            <b>Quantity:</b>
          </label>
          <div className="quantity-input">
            <button
              className={quantity <= 1 ? "not-allowed" : "quantity"}
              onClick={handleDecrement}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input type="text" id="quantity" name="quantity" value={quantity} readOnly />
            <button
              className={quantity >= product.stock_quantity ? "not-allowed" : "quantity"}
              onClick={handleIncrement}
              disabled={quantity >= product.stock_quantity}
            >
              +
            </button>
            {product.stock_quantity === 0 ? <p>&nbsp;&nbsp;(Out of stock)</p> : <></>}
          </div>
        </div>
        <br />
        <br />
        <br />
        {inCart > 0 ? (
          <label className="already-in-cart">✔ ALREADY ADDED</label>
        ) : (
          <button className="cart" onClick={handleAddToCart}>
            ADD TO CART
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDisplay;
