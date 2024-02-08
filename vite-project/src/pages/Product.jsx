import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import '../css/Product.css'
import ProductDisplay from "../component/ProductDisplay/ProductDisplay";
import Navbar from "../component/Navbar/Navbar";
import Popular from "../component/Popular/Popular";
import DescriptionBox from "../component/DescriptionBox/DescriptionBox";
import Loading from "../component/Loading/Loading";

const Product = () => {
  const {isLoggedIn,authUser} = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFilled,setIsFilled] = useState(false);
  const { productId } = useParams();
  const userId = authUser.user_id;

  const getProduct = async () => {
    if(isLoggedIn){
      try {
        const isFilledResponse = await fetch(`http://localhost:5000/customer/${userId}/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
        const res = await isFilledResponse.json();
        const {count} = res;
        console.log('hiiii    ' + count)
        if(count>0){
          setIsFilled(true);
        }
        const response = await fetch(`http://localhost:5000/${productId}`);
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(error.message);
        setLoading(false);
      }
    }
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
    return <Loading/>;
  }
  if (!product) {
    return (
      <h1
        style={{
          color: "red",
          fontWeight: "bold",
          alignContent: "center",
        }}
      >
        Product not found
      </h1>
    );
  }

return (
  <div>
    <Navbar />
    <div className="product-grid">
      <ProductDisplay product={product} isFilled = {isFilled}/>
      <DescriptionBox description={product.description}/>
      <br /><br />
      <Popular param={`similar-products/${productId}`} title='Related Picks'/>
    </div>
  </div>
);

};

export default Product;
