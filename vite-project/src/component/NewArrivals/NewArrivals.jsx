import './NewArrivals.css'
import React,{useEffect, useState} from 'react';
import Item from '../Item/Item'

const NewArrivals =  () => {
  const [products,setProducts] =useState([])
  
  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/new-arrival")
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
    <div className='new-arrivals'>
      <h1>NEW ARRIVALS</h1>
      <div className="new-arrivals-item">
        {products.map((item)=>{
            return <Item key={item.id} id={item.id} name={item.name} price={Math.round(item.price)} description = {item.description}/>
        })}
      </div>
    </div>
    </>
  )
}

export default NewArrivals
