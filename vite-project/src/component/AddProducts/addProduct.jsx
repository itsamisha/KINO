import React, { useState } from "react";
import "./addProduct.css"; // import CSS file for styling
import { useSellerAuth } from "../../context/SellerAuthContext.jsx";
import NavbarSeller from "../NavbarSeller/NavbarSeller.jsx";
import AddDiscountForm from "../AddDiscountForm/AddDiscountForm.jsx";
import "../../css/Registration.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Title from "../Title/Title.jsx";
import photo from "../assets/add-product.png";
import Footer from "../Footer/Footer.jsx";

const ProductForm = () => {
  const { isLoggedIn, authUser, setIsLoggedIn, setAuthUser } = useSellerAuth();

  if (!isLoggedIn) {
    window.location.href = "/sellerside";
  }
  const [formData, setFormData] = useState({
    userid: authUser.user_id,
    name: "",
    price: "",
    stockQuantity: "",
    description: "",
    discountPercentage: "",
    categories: [],
    photoUrl: "", // Change: Store image as URL instead of file
    startDate: new Date(),
    endDate: new Date(),
  });

  // Function to handle form input changes
  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // If the changed input is either start date or end date, update them accordingly
    if (name === "startDate" || name === "endDate") {
      setFormData({ ...formData, [name]: new Date(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

  console.log(formData.categories);
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate discount percentage

    if (
      formData.discountPercentage &&
      (formData.discountPercentage < 0 || formData.discountPercentage > 100)
    ) {
      alert("Please enter a valid discount percentage (0-100)");
      return;
    }
    // Validate start and end dates
    if (formData.discountPercentage && formData.startDate >= formData.endDate) {
      alert("End date must be after start date");
      return;
    }
    try {
      // Prepare form data
      const formDataToSend = {
        ...formData,

        categories: JSON.stringify(formData.categories), // Convert categories array to JSON string
        start_date: formData.startDate.toISOString(), // Convert start date to ISO string
        end_date: formData.endDate.toISOString(), // Convert end date to ISO string
      };
      //console.log(formDataToSend.categories);
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
        discountPercentage: "",
        categories: [],
        photoUrl: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div>
      <NavbarSeller />
      <Title title="Add a New Product" />
      <div className="add-product-cont">
        <img src={photo} className="man" alt="" />
      </div>
      <div className="product-form-container">
        <form onSubmit={handleSubmit}>
          <label className="signin-label">Name:</label>
          <input
           placeholder="Enter name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label className="signin-label">Price:</label>
          <input
           placeholder="Enter price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <label className="signin-label">Stock Quantity:</label>
          <input
            placeholder="Enter stock quantity"
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            required
          />
            <label className="signin-label">Discount Percentage:</label>
            <input
            placeholder="Enter discount percentage"
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
            />
            <label className="signin-label">Start Date:</label>
            <DatePicker

              selected={formData.startDate}
              onChange={(date) =>
                handleChange({ target: { name: "startDate", value: date } })
              }
            />
            <label className="signin-label">
              End Date:
              
            </label>
            <DatePicker
                selected={formData.endDate}
                onChange={(date) =>
                  handleChange({ target: { name: "endDate", value: date } })
                }
              />
          <label className="signin-label">
            Description:
            <textarea
            placeholder="Enter description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <div>
            <label className="signin-label">Categories:</label>
            <div>
              {formData.categories.map((category, index) => (
                <div key={index}>{category}</div>
              ))}
            </div>
            <input
            placeholder="Enter category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
            <button type="button" onClick={handleAddCategory}>
              Add Category
            </button>
          </div>
          <br />

          <label className="signin-label">
            Image URL:
           
          </label>
          <input
             placeholder="https://example.com/product-image.jpg"
              type="text"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              required
            />
            <br />
          <button className="button-style" type="submit">Add Product</button>
        </form>
      </div>
      <Footer/>
    </div>
  );
};

export default ProductForm;
