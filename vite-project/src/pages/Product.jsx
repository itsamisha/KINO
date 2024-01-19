import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductDisplay from "../component/ProductDisplay/ProductDisplay";
import Navbar from "../component/Navbar/Navbar";
import Mascot from "../component/Mascot/Mascot";

const Product = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { productId } = useParams();

  const getProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/${productId}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []); 

  if (loading) {
    return <h1></h1>;
  }
  if (!product ) {
    return <h1
    style={{ 
      color: 'red', 
      fontWeight: 'bold',
      alignContent: 'center'
    }}>Product not found</h1>; 
  }

  return (
    <div>
      <Navbar/>
      <Mascot/>
      <ProductDisplay product={product}/>
    </div>
  );
};

export default Product;

