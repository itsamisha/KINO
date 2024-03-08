import React, { useState } from 'react';
import './AdminShop.css';
import Navbar from '../Navbar/Navbar';
import InventoryItem from '../InventoryItem/InventoryItem';

const ShopAdmin = ({ products, shops }) => {
  const [selectedShop, setSelectedShop] = useState(null);

  // Group products by shop
  const productsByShop = {};
products.forEach(product => {
  if (!productsByShop[product.shop_id]) {
    productsByShop[product.shop_id] = {
      shop_name: product.shop_name,
      products: [],
    };
  }
  
  // Check if the product with the same product_id already exists in the products array
  const existingProductIndex = productsByShop[product.shop_id].products.findIndex(p => p.product_id === product.product_id);
  
  // If the product with the same product_id doesn't exist, add it to the products array
  if (existingProductIndex === -1) {
    productsByShop[product.shop_id].products.push(product);
  } else {
    // If the product with the same product_id already exists, update it
    productsByShop[product.shop_id].products[existingProductIndex] = product;
  }
});
  const handleShowAllProducts = (shopId) => {
    if (selectedShop !== shopId) { // Only update if the selected shop is different
      setSelectedShop(shopId);
    }
  };

  return (
    <div className="shop-admin-container">
      <div className="shop-list">
        <h2>Shops</h2>
        <ul>
          {shops.map(shop => (
            <li key={shop.user_id}>
              <button onClick={() => handleShowAllProducts(shop.user_id)}>
                {shop.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="product-list">
        <h2>Products</h2>
        {selectedShop && productsByShop[selectedShop] && (
          <div>
            <h3>{productsByShop[selectedShop].shop_name}</h3>
            {productsByShop[selectedShop].products.map(product => (
              <div key={product.product_id}>
                <InventoryItem
                  id={product.product_id}
                  name={product.name}
                  photo={product.photo_url}
                  purchase_count={product.purchase_count}
                  stock_quantity={product.stock_quantity}
                  discount={product.discount}
                />
                <br />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopAdmin;
