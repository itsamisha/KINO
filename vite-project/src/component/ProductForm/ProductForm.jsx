import React, { useState } from "react";
import "./ProductForm.css"; // You can create a separate CSS file for styling
import Title from "../Title/Title";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function ProductForm({ product, onCancel }) {
  const [formData, setFormData] = useState({
    product_id:product.product_id,
    name: product.name,
    price: product.price,
    category:product.category_name,
    stock_quantity: product.stock_quantity,
    discountPercentage:product.discount_percentage,
    startDate:product.start_date,
    end_date:product.end_date,
    description: product.description,
    photo_url: product.photo_url,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const updateProduct= async (data) => {
    try {
      const response = await fetch("http://localhost:5000/seller/updateproduct", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedProduct = await response.json();
      console.log(updatedProduct);
      return updatedProduct;
    } catch (error) {
      throw new Error('Failed to update product. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your update product logic here
    try {
        await updateProduct(formData);
       
        alert('Product updated successfully!');
    onCancel(); // Hide the form
   // window.history.back(); // Reload the previous page
   window.location.reload();
        setFormData({
          product_id:product.product_id,
            name: product.name,
            price: product.price,
            category:product.category_name,
            stock_quantity: product.stock_quantity,
            description: product.description,
            discountPercentage:product.discount_percentage,
            startDate:product.start_date,
            end_date:product.end_date,
            photo_url: product.photo_url,
        });
      } catch (error) {
        console.error('Error updating product:', error.message);
        alert('Failed to update product. Please try again.');
      }


  };

  return (
    <div className="modal">
      <div className="modal-content scrollable-container">
        <Title title="Update Product" />
        <br />
        <br />
        <br />
        <form onSubmit={handleSubmit}>
          <div className="info-row">
            <label className="info-label">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="info-row">
            <label className="info-label">Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="info-row">
            <label className="info-label">Stock Quantity:</label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="info-row">
            <label className="info-label">Categories:</label>
            <input
              
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="info-row">
            <label className="info-label">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="info-row">
            <label className="info-label"> Discount Percentage:</label>
            <input
            type="number"
            name="discountPercentage" 
            value={formData.discountPercentage}
            onChange={handleChange}
           
          />
          </div>
          <div className="info-row">
            <label className="info-label">  Start Date:</label>
            <DatePicker 
  selected={formData.startDate} 
  onChange={(date) => handleChange({ target: { name: "startDate", value: date } })}
/>

          </div>
          <div className="info-row">
            <label className="info-label"> End Date:</label>
            <DatePicker 
  selected={formData.endDate} 
  onChange={(date) => handleChange({ target: { name: "endDate", value: date } })}
/>

          </div>

          <div className="info-row">
            <label className="info-label">Photo URL:</label>
            <input
              type="text"
              name="photo_url"
              value={formData.photo_url}
              onChange={handleChange}
            />
            {/* Display image preview */}
            {formData.photo_url && (
              <img
              
                src={formData.photo_url}
                alt="Product"
                className="image-preview"
              />
            )}
          </div>
          <div className="button-container">
            <button type="submit" className="change-password-button">
              Save
            </button>
            <button
              type="button"
              className="change-password-button"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
