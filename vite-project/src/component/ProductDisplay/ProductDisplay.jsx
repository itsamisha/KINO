import './ProductDisplay.css'
import '../ImageSlider/ImageSlider'
import ImageSlider from '../ImageSlider/ImageSlider';
import Star from '../Star/Star';
import ProductPhoto from '../ProductPhoto/ProductPhoto';
import Heart from '../Heart/Heart';
const ProductDisplay = (props) => {
  const {product} = props;
  console.log(product);
  const url = product.photo_url
  const containerStyles = {
    width: "500px",
    height: "500px",
    margin : "auto"
};
  return (
    
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div style={containerStyles}>
        <ProductPhoto url={url}/>
        </div>
      </div>
      <div className="productdisplay-right">
        <h2>{product.name}</h2>
        <div className="productdisplay-right-star">
          <Star rating ={2.5} size={1.5}/>
        </div>
        
          {product.new_price !== product.price?
            (<div className="productdisplay-right-prices">
            <div className="productdisplay-right-price-new">
          ৳{product.new_price}
          </div>
          <div className="productdisplay-right-price-old">
          ৳{product.price}
          </div>
          </div>) :
          (<div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-new">
          ৳{product.price}
          </div>
          </div>)
}
        <br/>
        <div className="productdisplay-right-description">
          <b>Category: </b>{product.category_name}
          <br/><br/>
          <b>Seller: </b>{product.shop}
        </div>
        <br /><br />
        <button className='cart'>ADD TO CART</button>
      </div>
    </div>

  )
}

export default ProductDisplay
