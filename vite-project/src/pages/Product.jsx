import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductDisplay from "../component/ProductDisplay/ProductDisplay";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { productId } = useParams();

  const getPopularProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/popular");
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPopularProducts();
  }, []); 

  const product = products.find((e) => e.product_id === Number(productId));

  if (!product) {
    return <div>Product not found</div>; 
  }

  return (
    <div>
      <ProductDisplay product={product}/>
    </div>
  );
};

export default Product;

