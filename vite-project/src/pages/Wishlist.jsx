import Navbar from "../component/Navbar/Navbar"
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Item from "../component/Item/Item";
const Wishlist = () => {

    const [products, setProducts] = useState([]);
    const {isLoggedIn, authUser} = useAuth();
    const userId = authUser.user_id;
    if(!isLoggedIn){
        Navigate("/signin")
    }

    const getWishlist = async () => {
        try {
          const response = await fetch(`http://localhost:5000/customer/${userId}/wishlist`);
          const data = await response.json();
          console.log(data);
          setProducts(data);
        } catch (error) {
          console.log(error.message);
        }
      }
    
      useEffect(() => {
        getWishlist();
      }, []);

    
    return(
            <div className="container">
              <Navbar/>
              <div className='popular'>
                {products.map((item) => {
                  return <Item  key={item.product_id} id={item.product_id} name={item.name} price={item.price} photo={item.photo_url} description={item.description} new_price ={item.new_price} discount_pct ={item.discount_pct} />
                })}
              </div>
            </div>
    )
}

export default Wishlist
