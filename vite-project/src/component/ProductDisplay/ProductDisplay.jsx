import './ProductDisplay.css'
import '../ImageSlider/ImageSlider'
import ImageSlider from '../ImageSlider/ImageSlider';
import Star from '../Star/Star';
const ProductDisplay = (props) => {
  const {product} = props;
  console.log(product);
  const urls = [product.photo_url]
  const containerStyles = {
    width: "500px",
    height: "500px",
    margin : "auto"
};
  return (
    
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div style={containerStyles}>
        <ImageSlider urls={urls}/>
        </div>
        {/* <div className="productdisplay-image-list">
          <img src={product.photo_url} alt=""/>
          <img src={product.photo_url} alt=""/>
          <img src={product.photo_url} alt=""/>
          <img src={product.photo_url} alt=""/>
        </div>
        <div className="productdisplay-img">
          <img className='productdisplay-main-img' src={product.photo_url}/>
        </div> */}
      </div>
      <div className="productdisplay-right">
        <h4>{product.name}</h4>
        <div className="productdisplay-right-star">
          <Star rating ={0}/>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
          ৳{Math.round(product.price)}
          </div>
          <div className="productdisplay-right-price-new">
          ৳{Math.round(product.price)}
          </div>
        </div>
        <div className="productdisplay-right-description">
          {product.description}
        </div>
        <br /><br />
        <button>ADD TO CART</button>
      </div>
    </div>

  )
}

export default ProductDisplay
