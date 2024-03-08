import React, { useState, useEffect } from 'react';
import "../css/admin.css"
import { Link, Navigate } from "react-router-dom";
import Navbar from '../component/Navbar/Navbar';
import SellerProductDisplay from '../component/SellerProductDisplay/SellerProductDisplay';
import InventoryItem from "../component/InventoryItem/InventoryItem";
import OrderStatusPieChart from '../component/OrderStatusPieChart/OrderStatusPieChart';
import ShopAdmin from '../component/AdminShop/AdminShop';
import GiftCardGraph from '../component/GiftCardGraph/GiftCardGraph';
import Order from '../component/AdminOrder/AdminOrder';
import ShippingPieChart from '../component/ShippingPieChart/ShippingPieChart'; 
const Admin = () => {
    const [activeTab, setActiveTab] = useState('users');
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const [users, setUsers] = useState([]);
    const [shops, setShops] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [giftCards, setGiftCards] = useState([]);
    const [showGiftCards, setShowGiftCards] = useState(false);
    const [customerCount, setCustomerCount] = useState(0);
    const [sellerCount, setSellerCount] = useState(0);
    const [products, setProducts] = useState([]);
    const [lowStockProducts, setlowStockProducts] = useState([]);
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [topUsers, setTopUsers] = useState([]);
    const [topSellers, setTopSellers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch users
                const userResponse = await fetch(`http://localhost:5000/admin/users`);
                if (!userResponse.ok) {
                    throw new Error('Failed to fetch users list');
                }
                const userData = await userResponse.json();
                setUsers(userData);
                setFilteredUsers(userData); // Initialize filtered users with all users
                
                // Count customers and sellers
                const customers = userData.filter(user => user.user_type === 'customer');
                const sellers = userData.filter(user => user.user_type === 'seller');
                setCustomerCount(customers.length);
                setSellerCount(sellers.length);
                //getshops
                
            setShops(sellers);
            // Fetch top users
            const topUsersResponse = await fetch(`http://localhost:5000/admin/top-users`);
            if (!topUsersResponse.ok) {
                throw new Error('Failed to fetch top users');
            }
            const topUsersData = await topUsersResponse.json();
            setTopUsers(topUsersData);

            // Fetch top sellers
            const topSellersResponse = await fetch(`http://localhost:5000/admin/top-sellers`);
            if (!topSellersResponse.ok) {
                throw new Error('Failed to fetch top sellers');
            }
            const topSellersData = await topSellersResponse.json();
            setTopSellers(topSellersData);

                // Fetch gift cards
                const giftCardResponse = await fetch(`http://localhost:5000/admin/giftcards`);
                if (!giftCardResponse.ok) {
                    throw new Error('Failed to fetch gift cards');
                }
                const cardData = await giftCardResponse.json();
                setGiftCards(cardData);

                const response = await fetch(`http://localhost:5000/admin/products`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
            
            // Fetch low stock products with all details
            const lowStockResponse = await fetch(`http://localhost:5000/admin/low-stock-products`);
            if (!lowStockResponse.ok) {
                throw new Error('Failed to fetch low stock products');
            }
            const lowStockData = await lowStockResponse.json();
            setlowStockProducts(lowStockData);
            
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };
        
        fetchData();
    }, []);

    // Function to filter users by user type
    const filterUsers = (userType) => {
        const filtered = users.filter(user => user.user_type === userType);
        setFilteredUsers(filtered);
        setShowGiftCards(false); // Reset showGiftCards state
    };
    console.log(lowStockProducts);

    // Function to handle showing only gift cards
    const handleShowGiftCards = () => {
        setFilteredUsers([]); // Clear filtered users
        setShowGiftCards(true);
    };

    // Function to handle showing all products
    const handleShowAllProducts = () => {
        setShowAllProducts(true);
    };

    const filteredProducts = Array.from(new Set(products.map(product => product.product_id))).map(product_id => {
        return products.find(product => product.product_id === product_id);
    });
    function groupProductsByShop(products) {
        const groupedProducts = {};
        products.forEach(product => {
            if (!groupedProducts[product.shop_name]) {
                groupedProducts[product.shop_name] = [];
            }
            groupedProducts[product.shop_name].push(product);
        });
        return groupedProducts;
    }
    
    


return (
    <div>
        <Navbar />
        <div className="admin-container">
            <div className="side-tab">
                <button onClick={() => handleTabChange('users')}>All Users</button>
                <button onClick={() => handleTabChange('giftCards')}>Gift Cards</button>
                <button onClick={() => handleTabChange('products')}>Products</button>
                <button onClick={() => handleTabChange('orders')}>All Orders</button>
                <button onClick={() => handleTabChange('orderStats')}>Order Stats</button>
                {/* Add more buttons for other options */}
            </div>
            <div className="admin-dashboard">
                {activeTab === 'users' && (
                    <section>
                        <h2>Users</h2>
                        <div className="filtered-buttons">
                            <button onClick={() => filterUsers('customer')}>Show Customers ({customerCount})</button>                    
                            <button onClick={() => filterUsers('seller')}>Show Sellers ({sellerCount})</button>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>User Type</th>
                                    <th>Phone Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.user_id}>
                                        <td>{user.user_id}</td>
                                        <td>{user.email}</td>
                                        <td>{user.name}</td>
                                        <td>{user.user_type}</td>
                                        <td>{user.phone_number}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}
                
                {activeTab === 'giftCards' && (
                    <section>
                        <h2>Gift Cards</h2>
                        <ul>
                            {giftCards.map(giftCard => (
                                <li key={giftCard.gift_card_id}>Amount: ${giftCard.amount}, User ID: {giftCard.user_id},Purchase Date:{giftCard.purchase_date}</li>
                            ))}
                        </ul>
                        <GiftCardGraph giftCards={giftCards}/>
                    </section>
                )}
                {activeTab === 'products' && (
                    <section>
                        <ShopAdmin products={products} shops={shops} />
                    </section>
                )}
                {activeTab === 'orders' && (
                    <section>
                        <Order/>
                    </section>
                )}
                {activeTab === 'orderStats' && (
            <section>
              <h1>Order Statistics</h1>
              <h2>Order Location Pie Chart</h2>
              <ShippingPieChart />
              <OrderStatusPieChart orderData={products} />
            </section>
          )}
                {/* Add more sections for other tabs */}
            </div>
        </div>
    </div>
);

                };

export default Admin;
