import React, { useState, useEffect } from 'react';
import "../css/admin.css"
import Navbar from '../component/Navbar/Navbar';
const Admin = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [giftCards, setGiftCards] = useState([]);
    const [showGiftCards, setShowGiftCards] = useState(false);
    const [customerCount, setCustomerCount] = useState(0);
    const [sellerCount, setSellerCount] = useState(0);
    const [products, setProducts] = useState([]);

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

                // Fetch gift cards
                const giftCardResponse = await fetch(`http://localhost:5000/admin/giftcards`);
                if (!giftCardResponse.ok) {
                    throw new Error('Failed to fetch gift cards');
                }
                const cardData = await giftCardResponse.json();
                setGiftCards(cardData);

                //fetch all products with all details
                const response = await fetch(`http://localhost:5000/admin/products`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
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

    // Function to handle showing only gift cards
    const handleShowGiftCards = () => {
        setFilteredUsers([]); // Clear filtered users
        setShowGiftCards(true);
    };

    return (
        <div>
             <Navbar/>
        <div className="admin-dashboard">
           
            <h1>Admin Dashboard</h1>

            {/* Filter buttons */}
            <div>
                <button onClick={() => filterUsers('customer')}>Show Customers ({customerCount})</button>
                <button onClick={() => filterUsers('seller')}>Show Sellers ({sellerCount})</button>
                <button onClick={() => setFilteredUsers(users)}>Show All Users ({users.length})</button>
                <button onClick={handleShowGiftCards}>Show Gift Cards</button>
            </div>

            {/* Display Users */}
            {!showGiftCards && (
                <section>
                    <h2>Users</h2>
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

            {/* Display Gift Cards */}
            {showGiftCards && (
                <section>
                    <h2>Gift Cards</h2>
                    <ul>
                        {giftCards.map(giftCard => (
                            <li key={giftCard.gift_card_id}>Amount: ${giftCard.amount}, User ID: {giftCard.user_id}</li>
                        ))}
                    </ul>
                </section>
            )}
             <section>
                <h2>Products</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock Quantity</th>
                            <th>Description</th>
                            <th>Photo URL</th>
                            <th>Discount</th>
                            <th>Review</th>
                            <th>Order Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.product_id}>
                                <td>{product.product_id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.stock_quantity}</td>
                                <td>{product.description}</td>
                                <td>{product.photo_url}</td>
                                <td>{product.discount_id ? `Discount ID: ${product.discount_id}, Percentage: ${product.discount_percentage}%` : 'No Discount'}</td>
                                <td>{product.review_id ? `User ID: ${product.user_id}, Review Text: ${product.review_text}, Rating: ${product.rating}` : 'No Reviews'}</td>
                                <td>{product.order_item_id ? `Order ID: ${product.order_id}, Quantity: ${product.quantity}` : 'No Order Items'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
        </div>
    );
};

export default Admin;
