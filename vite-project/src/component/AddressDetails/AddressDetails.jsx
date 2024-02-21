import React, { useEffect, useState } from 'react';
import './AddressDetails.css';

const AddressDetails = ({ onPostCodeChange, fixShippingCharge }) => {
  const [postCode, setPostCode] = useState("");
  const [data, setData] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/customer/post_code/${postCode}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
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
    if(data){
        fixShippingCharge(data.shipping_charge)
    }
    else
    {
        fixShippingCharge(0)
    }
  },[data])

  return (
    <div>
      <input type='text' value={postCode} onChange={handlePostCodeChange}/> 
      {data ? (
        <div>
          <p>Sub-office:&nbsp;{data.suboffice}</p>
          <p>Thana:&nbsp;{data.thana}</p>
          <p>District:&nbsp;{data.district}</p>
          <p>Division:&nbsp;{data.division}</p>
        </div>
      ) : <></>}
    </div>
  );
};

export default AddressDetails;
