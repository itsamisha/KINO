import {Link} from 'react-router-dom'

const ProductPhoto = ({url}) => {
  const sliderStyles = {
    height: '100%',
    position: "relative"
  }
  const slideStyles = {
    width: "100%",
    height: "100%",
    backgroundPosition: 'center',
    backgroundSize: "cover",
    backgroundImage : `url(${url})`,
    border: "1px solid rgba(0, 0, 0, 0.2)", 
   transition: "transform 0.3s ease-in-out", 
   boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)", 
}

  return (
    <div style={sliderStyles}>
        <Link to={`${url}`} target="_blank" rel="noopener noreferrer">
        <div style={slideStyles}></div>
        </Link>
    </div>
  )
};

export default ProductPhoto;
