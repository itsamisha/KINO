import React, { useEffect, useState } from "react";
import "./AddressDetails.css";

const AddressDetails = ({ onPostCodeChange, fixShippingCharge }) => {
  const [postCode, setPostCode] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/customer/post_code/${postCode}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        setData(responseData[0]);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (postCode) {
      fetchData();
    }
  }, [postCode]);

  const handlePostCodeChange = (event) => {
    const { value } = event.target;
    setPostCode(value);
    onPostCodeChange(value);
  };

  useEffect(() => {
    if (data) {
      fixShippingCharge(data.shipping_charge);
    } else {
      fixShippingCharge(0);
    }
  }, [data]);

  return (
    <div>
      <div className="c-info-row">
        <label className="c-info-label">Post Code:</label>
        <input
          className="c-info-input"
          type="text"
          value={postCode}
          onChange={handlePostCodeChange}
          placeholder="Enter a valid post code"
          required
        />
      </div>
      {data ? (
        <div className="address-details">
          <p>
            <strong>Sub-office-</strong>&nbsp;{data.suboffice}
          </p>
          <p>
            <strong>Thana-</strong>&nbsp;{data.thana}
          </p>
          <p>
            <strong>District-</strong>&nbsp;{data.district}
          </p>
          <p>
            <strong>Division-</strong>&nbsp;{data.division}
          </p>
          <br /><br />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AddressDetails;
