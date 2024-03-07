import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddDiscountForm = ({ productId, addDiscount }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [discountPercentage, setDiscountPercentage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate discount percentage
    if (!discountPercentage || discountPercentage < 0 || discountPercentage > 100) {
      alert("Please enter a valid discount percentage (0-100)");
      return;
    }
    // Validate start and end dates
    if (startDate >= endDate) {
      alert("End date must be after start date");
      return;
    }
    // Call addDiscount function from parent component
    addDiscount({
      product_id: productId,
      start_date: startDate,
      end_date: endDate,
      discount_percentage: discountPercentage,
    });
    // Clear form inputs
    setStartDate(new Date());
    setEndDate(new Date());
    setDiscountPercentage("");
  };

  return (
    <div className="discount-form-container">
      <h2>Add Discount</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Discount Percentage:
          <input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            required
          />
        </label>
        <label>
          Start Date:
          <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
        </label>
        <label>
          End Date:
          <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
        </label>
        <button type="submit">Add Discount</button>
      </form>
    </div>
  );
};

export default AddDiscountForm;
