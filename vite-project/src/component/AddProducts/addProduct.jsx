import React, { useState } from "react";
import "./addProduct.css"; // import CSS file for styling
import { useSellerAuth } from "../../context/SellerAuthContext.jsx";
import NavbarSeller from "../NavbarSeller/NavbarSeller.jsx";

const ProductForm = () => {
  // State variables to hold form data
  const { isLoggedIn, authUser, setIsLoggedIn, setAuthUser } = useSellerAuth();
  const [formData, setFormData] = useState({
    userid: authUser.user_id,
    name: "",
    price: "",
    stockQuantity: "",
    description: "",
    categories: [],
    photoUrl: "", // Change: Store image as URL instead of file
  });

  // Function to handle form input changes
  // Function to handle form input changes
const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  

  // Function to add category to the list
  const handleAddCategory = () => {
    if (formData.category) {
      setFormData({
        ...formData,
        categories: [...formData.categories, formData.category],
        category: "", // Clear the category input field
      });
    }
  };
  
  console.log(formData. categories);
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare form data
      const formDataToSend = {
        ...formData,
        categories: JSON.stringify(formData.categories), // Convert categories array to JSON string
        
      };
         console.log(formDataToSend.categories);
      // Make POST request to server to add product
      const response = await fetch("http://localhost:5000/seller/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });
      
      const data = await response.json();
      if (data.success) {
        alert("Product Added!\n ");
        window.location.href = "/seller";
      } else {
        alert("Product not Added!");
      }
      
      // Clear form data after successful submission
      setFormData({
        userid: authUser.user_id,
        name: "",
        price: "",
        stockQuantity: "",
        description: "",
        categories: [],
        photoUrl: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div>
       
    <div className="product-form-container">
      <h2>Add a New Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Stock Quantity:
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <div>
          <label>Categories:</label>
          <div>
            {formData.categories.map((category, index) => (
              <div key={index}>{category}</div>
            ))}
          </div>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
          <button type="button" onClick={handleAddCategory}>
            Add Category
          </button>
        </div>
        {/* Input for image URL */}
        <label>
          Image URL:
          <input
  type="text"
  name="photoUrl" // Set the name attribute to "photoUrl"
  value={formData.photoUrl}
  onChange={handleChange}
  required
/>

        </label>
        <button type="submit">Add Product</button>
      </form>
    </div>
    </div>
  );
};

export default ProductForm;
