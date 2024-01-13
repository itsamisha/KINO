import './Popular.css'
import React,{useEffect, useState} from 'react';
import Item from '../Item/Item'

const Popular =  () => {

  const [products,setProducts] =useState([])
  
  const getPopularProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/popular")
      const data = await response.json()
      setProducts(data) 
    } catch (error) {
      console.log(error.message)
    }
  }
  
  useEffect(() => {
    getPopularProducts();
}, [])

  return (
    <>
         <h1 className='popular-h1'>POPULAR</h1>
        <div className='popular'>
        {products.map((item)=>{
            return <Item key={item.id} id={item.id} name={item.name} price={Math.round(item.price)} photo={item.photo_url} description = {item.description}/>
        })}
    </div>
    </>
  )
}

export default Popular
