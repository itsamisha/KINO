import React, { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {ArcElement} from 'chart.js';

import OrderStatusPieChart from '../component/OrderStatusPieChartSeller/OrderStatusPieChartSeller';
import ProductDisplay from '../component/SellerProductDisplay/SellerProductDisplay';
import DescriptionBox from "../component/DescriptionBox/DescriptionBox";
import Loading from "../component/Loading/Loading";
import Review from "../component/Review/Review";
import "../css/Analytics.css";
import NavbarSeller from "../component/NavbarSeller/NavbarSeller";
import { useSellerAuth } from "../context/SellerAuthContext";
import SellerSidebar from "../component/SellerSidebar/SellerSidebar";
import Chart from 'chart.js/auto';
import {Link, Navigate, useNavigate } from "react-router-dom";
import InventoryItem from "../component/InventoryItem/InventoryItem"; 
import Footer from '../component/Footer/Footer';

const AnalyticsPage = () => {
    Chart.register(ArcElement);
    const navigate = useNavigate();
  const { isLoggedIn, authUser } = useSellerAuth();
  const [loading, setLoading] = useState(true);
  const [isFilled,setIsFilled] = useState(false);
  const [inCart,setInCart] = useState(-1)
  console.log(isLoggedIn)
 
  if (!isLoggedIn) {
    return <Navigate to="/signin"/>
  }

  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topSoldProducts, setTopSoldProducts] = useState([]);
  const [worstRatedProducts, setWorstRatedProducts] = useState([]);
  const [leastSoldProducts, setLeastSoldProducts] = useState([]);
  const [orderStatusDistribution, setOrderStatusDistribution] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const id = parseInt(authUser.user_id);
   console.log(id);

   const handleClick = () => {
    return <Navigate to="/addproduct"/>
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch top-rated products
        const topRatedResponse = await fetch(`http://localhost:5000/seller/${id}/top-rated-products`);
        if (!topRatedResponse.ok) {
          throw new Error('Failed to fetch top-rated products');
        }
        const topRatedData = await topRatedResponse.json();
        setTopRatedProducts(topRatedData);

        // Fetch worst-rated products
        const worstRatedResponse = await fetch(`http://localhost:5000/seller/${id}/worst-rated-products`);
        if (!worstRatedResponse.ok) {
          throw new Error('Failed to fetch top-rated products');
        }
        const worstRatedData = await worstRatedResponse.json();
        setWorstRatedProducts(worstRatedData);


        // Fetch top-sold products
        const topSoldResponse = await fetch(`http://localhost:5000/seller/${id}/top-sold-products`);
        if (!topSoldResponse.ok) {
          throw new Error('Failed to fetch top-sold products');
        }
        const topSoldData = await topSoldResponse.json();
        setTopSoldProducts(topSoldData);
       // console.log(topSoldData);
        

        // Fetch least-sold products
        const leastSoldResponse = await fetch(`http://localhost:5000/seller/${id}/least-sold-products`);
        if (!leastSoldResponse.ok) {
          throw new Error('Failed to fetch top-sold products');
        }
        const leastSoldData = await leastSoldResponse.json();
        setLeastSoldProducts(leastSoldData);

        //lowstock
        const lowstockResponse = await fetch(`http://localhost:5000/seller/${id}/low-stock-products`);
        if (!lowstockResponse.ok) {
          throw new Error('Failed to fetch stock nai products');
        }
        const lowstockData = await lowstockResponse.json();
        setLowStockProducts(lowstockData);


        // Fetch order status distribution
        const orderStatusResponse = await fetch(`http://localhost:5000/seller/${id}/order-status-distribution`);
        if (!orderStatusResponse.ok) {
          throw new Error('Failed to fetch order status distribution');
        }
        const orderStatusData = await orderStatusResponse.json();
        setOrderStatusDistribution(orderStatusData);
        

        // Fetch revenue data
        const revenueResponse = await fetch(`http://localhost:5000/seller/${id}/revenue-data`);
        if (!revenueResponse.ok) {
          throw new Error('Failed to fetch revenue data');
        }
        const revenueData = await revenueResponse.json();
        setRevenueData(revenueData);
      } catch (error) {
         console.error('Error fetching data:', error.message);
       }
    };

    fetchData();
  }, []);
  console.log(orderStatusDistribution);
  return (
    <div className='product-grid-analytics'>
        <NavbarSeller/>
        <SellerSidebar/>
      <h1>Analytics Dashboard</h1>

      <div>
      <h2>Top Rated Products</h2>
      <ul>
      <br /><br /><br />
      {topRatedProducts.length > 0 ? (
        topRatedProducts.map((item) => (
          <>
            <InventoryItem
              key={item.product_id}
              id={item.product_id}
              name={item.name}
              photo={item.photo_url}
              purchase_count={item.purchase_count}
              stock_quantity={item.stock_quantity}
              discount={item.discount}
              

            />
            <br />
          </>
        ))
      ) : (<div>
        <Link to="/seller">
          <h1>Inventory empty</h1>
        </Link>
        <button className='an-button' onClick={handleClick}> 
            Add Products
        </button>
        </div>
      )}
      </ul>
    </div>

    <div>
  <h2>Top Sold Products</h2>
  <ul >
    {topSoldProducts.length > 0 ? (
      topSoldProducts.map(product => (
        <li key={product.product_id}>
          <InventoryItem
            id={product.product_id}
            name={product.name}
            photo={product.photo_url}
            purchase_count={product.purchase_count}
            stock_quantity={product.stock_quantity}
            discount={product.discount}
          />
        </li>
      ))
    ) : (
      <div>
        <h1>No top sold products found</h1>
      </div>
    )}
  </ul>
</div>

<div>
  <h2>Least Sold Products</h2>
  <ul >
    {leastSoldProducts.length > 0 ? (
      leastSoldProducts.map(product => (
        <li key={product.product_id}>
          <InventoryItem
            id={product.product_id}
            name={product.name}
            photo={product.photo_url}
            purchase_count={product.purchase_count}
            stock_quantity={product.stock_quantity}
            discount={product.discount}
          />
        </li>
      ))
    ) : (
      <div>
        <h1>No least sold products found</h1>
      </div>
    )}
  </ul>
</div>

<div>
  <h2>Worst Rated Products</h2>
  <ul >
    {worstRatedProducts.length > 0 ? (
      worstRatedProducts.map(product => (
        <li key={product.product_id}>
          <InventoryItem
            id={product.product_id}
            name={product.name}
            photo={product.photo_url}
            purchase_count={product.purchase_count}
            stock_quantity={product.stock_quantity}
            discount={product.discount}
          />
        </li>
      ))
    ) : (
      <div>
        <h1>No worst rated products found</h1>
      </div>
    )}
  </ul>
</div>

<div>
  <h2>Low Stock Products</h2>
  <ul >
    {lowStockProducts.length > 0 ? (
      lowStockProducts.map(product => (
        <li key={product.product_id}>
          <InventoryItem
            id={product.product_id}
            name={product.name}
            photo={product.photo_url}
            purchase_count={product.purchase_count}
            stock_quantity={product.stock_quantity}
            discount={product.discount}
          />
        </li>
      ))
    ) : (
      <div>
        <h1>No lowStockProducts found</h1>
      </div>
    )}
  </ul>
</div>


      <div>
        <h2>Order Status Distribution</h2>
        <OrderStatusPieChart  uniqueOrderData={orderStatusDistribution} />

        {/* <Pie data={{
          labels: orderStatusDistribution.map(status => status.status),
          datasets: [{
            data: orderStatusDistribution.map(status => status.count),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // You can add more colors as needed
          }],
        }} /> */}
      </div>

      <div>
        <h2>Revenue Data</h2>
        <Line data={{
          labels: revenueData.map(data => data.order_date),
          datasets: [{
            label: 'Revenue',
            data: revenueData.map(data => data.revenue),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          }],
        }} />
      </div>
      <Footer/>
    </div>
  );
};

export default AnalyticsPage;
