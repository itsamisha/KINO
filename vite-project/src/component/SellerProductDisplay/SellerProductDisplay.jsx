import "./SellerProductDisplay.css";
import "../ImageSlider/ImageSlider";
import { useState } from "react";
import { useSellerAuth } from "../../context/SellerAuthContext";
import Star from "../Star/Star";
import ProductPhoto from "../ProductPhoto/ProductPhoto";
import Heart from "../Heart/Heart";
import ProductForm from "../ProductForm/ProductForm";

const SellerProductDisplay = (props) => {
  const { product } = props;
  const { isFilled } = props;
  const { inCart } = props;
  const url = product.photo_url;
  const product_id = product.product_id;
  const rating = product.rating;
  const { isLoggedIn, authUser } = useSellerAuth();
  const [quantity, setQuantity] = useState(1);
  const user_id = authUser.user_id;
  const [showEditForm, setShowEditForm] = useState(false);
  const handleClick=()=>{

  }

  function editProduct() {
    
    setShowEditForm(true);
  }

  
  return (
    <>
   
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div style={{ width: "500px", height: "500px", margin: "auto" }}>
          <ProductPhoto url={url} />
        </div>
      </div>
      <div className="productdisplay-right">
        <div className="name-heart-container">
          <h2>{product.name}</h2>
         
        </div>
        <div className="productdisplay-right-star">
          <Star rating={rating} size={1.5} />
        </div>

        {product.new_price !== product.price ? (
          <div className="productdisplay-right-prices">
            <div className="productdisplay-right-price-new">৳{product.new_price}</div>
            <div className="productdisplay-right-price-new"><b>Discount Percentage : </b>{product.discount_percentage}</div>
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
          { product.category_name}
         
        </div>
        <br />
        <div className="quantity-container">
          <label htmlFor="quantity">
            <b>Stock Quantity: </b>
            {
                product.stock_quantity
            }
          </label>
          
          <div >
          <button className="update-button" onClick={editProduct}>
          Update Product 
          </button>
          </div>
          
        </div>
        <br />
        <br />
        <br />
       
      </div>
    </div>
    {showEditForm && (
        <ProductForm
          authUser={authUser}
          product={product}
          onCancel={() => setShowEditForm(false)}

        />
      )}
    </>
  );
};

export default SellerProductDisplay;
