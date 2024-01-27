import './DiscountProduct.css'
import React,{useEffect, useState} from 'react';
import Item from '../Item/Item'
const DiscountProduct=()=>{
    const [products,setProducts] =useState([])
  
  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/discount-product")
      const data = await response.json()
      setProducts(data) 
    } catch (error) {
      console.log(error.message)
    }
  }
  
  useEffect(() => {
    getProducts();
}, [])

  return (
    <>
    <div className='discount-product'>
      <h1>ON SALE</h1>
      <div className="discount-product-item">
        {products.map((item)=>{
            return <Item key={item.id} id={item.id} name={item.name} price={Math.round(item.price)} description = {item.description}/>
        })}
      </div>
    </div>
    </>
  )
}
export default DiscountProduct;